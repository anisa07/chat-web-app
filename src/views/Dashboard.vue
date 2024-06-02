<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { ref } from 'vue'
import {
  submitMessage,
  loadConversationMessages,
  loadUserConversations
} from '@/services/conversationService'
import type { ArchiveMessage, Conversation, User } from '@/types/app-types'
import MessageInput from '@/components/MessageInput.vue'
import SearchInput from '@/components/SearchInput.vue'
import Conversations from '@/components/Conversations.vue'
import Messages from '@/components/Messages.vue'
import { verifyToken } from '@/utils/sessionUtils'

let socket: Socket | null = null

const router = useRouter()
const { getUser, findUserById } = useAuthStore()

const messages = ref<ArchiveMessage[]>([])
const conversations = ref<Conversation[]>([])
const owner = ref<User | null>(null)
const currentConversation = ref<Conversation | null>(null)

const getConversationHistory = async (conversationId: string) => {
  if (!conversationId) {
    return
  }
  const response = await loadConversationMessages(conversationId)
  messages.value = response.data.sort(
    (a: ArchiveMessage, b: ArchiveMessage) =>
      new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
  )
}

const selectUserToChat = async (user: User) => {
  const conversation = conversations.value.find(
    (chat) => chat.participants.length === 1 && chat.participants[0].userId === user.userId
  )
  if (conversation) {
    currentConversation.value = conversation
  }
  if (!conversation) {
    currentConversation.value = { conversationId: '', participants: [user] }
  }
  getConversationHistory(conversation?.conversationId ?? '')
}

const getUserConversations = async (userId: string) => {
  const response = await loadUserConversations(userId)
  conversations.value = response.data
}

const selectConversation = async (conversationId: string) => {
  const conversationIndex = conversations.value.findIndex(
    (chat) => chat.conversationId === conversationId
  )
  if (conversationIndex > -1) {
    conversations.value[conversationIndex] = {
      ...conversations.value[conversationIndex],
      newMessage: false
    }
    currentConversation.value = conversations.value[conversationIndex]
    getConversationHistory(conversationId)
  }
}

const sendMessage = async (value: string) => {
  if (!owner.value || !value) {
    return
  }
  if (!currentConversation.value) {
    return
  }
  await submitMessage({
    fromId: owner.value.userId,
    toIds: currentConversation.value.participants.map((p) => p.userId),
    message: value,
    conversationId: currentConversation.value.conversationId ?? ''
  })
}

onMounted(async () => {
  const tokenPayload = await verifyToken()
  if (tokenPayload && tokenPayload.userId) {
    await findUserById(tokenPayload.userId)
  }

  if (!getUser || !getUser.loggedIn) {
    router.push({ path: '/login' })
    return
  }

  if (getUser.data && getUser.data.data) {
    owner.value = getUser.data.data as User
  }

  getUserConversations(owner.value?.userId ?? '')

  socket = io(import.meta.env.VITE_SERVICE_URL, {
    query: { userId: owner.value?.userId }
  })
  socket.on('connect', () => {
    console.log('Successfully connected to the server')
    console.log('Client socket ID is', socket?.id)
  })
  socket.on('message', (message: string) => {
    const msgAsObject = JSON.parse(message)
    if (
      msgAsObject.conversationId === currentConversation.value?.conversationId ||
      (!currentConversation.value?.conversationId &&
        currentConversation.value?.participants &&
        currentConversation.value?.participants.find((p) => p.userId === msgAsObject.from.userId))
    ) {
      messages.value = [
        ...messages.value,
        {
          messageId: msgAsObject.messageId,
          message: msgAsObject.message,
          createdAt: msgAsObject.createdAt,
          author: {
            name: msgAsObject.from.name,
            userId: msgAsObject.from.userId
          }
        }
      ]
      if (!currentConversation.value?.conversationId) {
        currentConversation.value = {
          conversationId: msgAsObject.conversationId,
          participants: [msgAsObject.from],
          newMessage: false
        }
      }
    }
    const conversationIndex = conversations.value.findIndex(
      (chat) => chat.conversationId === msgAsObject.conversationId
    )
    if (conversationIndex === -1) {
      const newMessage = currentConversation.value?.conversationId !== msgAsObject.conversationId
      conversations.value = [
        ...conversations.value,
        {
          conversationId: msgAsObject.conversationId,
          participants: [msgAsObject.from],
          newMessage
        }
      ]
    } else {
      conversations.value[conversationIndex] = {
        ...conversations.value[conversationIndex],
        newMessage: true
      }
    }
  })
  socket.on('disconnect', () => {
    console.log('Socket is disconnected', socket?.id)
  })
  socket.on('connect_error', () => {
    setTimeout(() => {
      socket?.connect()
    }, 1000)
    console.log('error with connection ....')
  })
})

onBeforeUnmount(() => {
  socket?.disconnect()
})
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-col p-4 mr-2 border-r border-r-slate-950">
      <SearchInput @select-user="selectUserToChat" />

      <!-- List of users -->
      <Conversations :conversations="conversations" @select-conversation="selectConversation" />
    </div>

    <div class="flex-1 p-2 flex flex-col">
      <div class="">
        To
        {{
          currentConversation?.participants
            // .filter((participant) => participant.userId !== owner.userId)
            .map((participant) => participant.name)
            .join(' ') ?? ''
        }}
      </div>

      <!-- History prev chat -->
      <Messages :messages="messages" />

      <!-- Our user name and status -->
      <div class="owner">From {{ owner?.name }}</div>

      <!-- Typing area -->
      <MessageInput
        :disabledSendButton="currentConversation?.participants?.length === 0"
        @send-message="sendMessage"
      />
    </div>
  </div>
</template>
