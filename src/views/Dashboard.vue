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
  loadUserConversations,
  updateConversationMessages,
  updateConversation
  // notifyParticipants
} from '@/services/conversationService'
import type { ArchiveMessage, Conversation, User } from '@/types/app-types'
import MessageInput from '@/components/MessageInput.vue'
import SearchInput from '@/components/SearchInput.vue'
import Conversations from '@/components/Conversations.vue'
import Messages from '@/components/Messages.vue'
import { verifyToken } from '@/utils/sessionUtils'
import ConversationParticipant from '@/components/ConversationParticipant.vue'
import { debounce } from '../utils/debounce'

let socket: Socket | null = null

const router = useRouter()
const { getUser, findUserById, logOut } = useAuthStore()

const messages = ref<ArchiveMessage[]>([])
const conversations = ref<Conversation[]>([])
const owner = ref<User | null>(null)
const currentConversation = ref<Conversation | null>(null)
const typing = ref<string[]>([])

const typeMessage = debounce((value: string) => {
  if (socket && currentConversation && owner.value) {
    socket.emit(
      'user-typing',
      JSON.stringify({
        conversationId: currentConversation.value?.conversationId,
        participantIds: (currentConversation.value?.participants || []).map((p) => p.userId),
        user: owner.value.name,
        userId: owner.value.userId,
        typing: value
      })
    )
  }
})

const getConversationHistory = async (conversationId: string) => {
  if (!conversationId || !owner.value?.userId) {
    return
  }
  const response = await loadConversationMessages(owner.value?.userId, conversationId)
  messages.value = response.sort(
    (a: ArchiveMessage, b: ArchiveMessage) =>
      new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
  )
  await updateConversationMessages(conversationId, owner.value?.userId ?? '')
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
  await getConversationHistory(conversation?.conversationId ?? '')
}

const addNewUserToChat = async (user: User) => {
  const index = conversations.value.findIndex(
    (conversation) => conversation.conversationId === currentConversation.value?.conversationId
  )

  if (!currentConversation.value) {
    return
  }

  if (currentConversation.value.participants.find((p) => p.userId === user.userId)) {
    return
  }

  if (currentConversation.value.conversationId === '') {
    currentConversation.value = {
      ...currentConversation.value,
      participants: [...currentConversation.value.participants, user]
    }
  }

  if (index === -1) {
    return
  }

  conversations.value[index] = {
    ...conversations.value[index],
    participants: [...conversations.value[index].participants, user]
  }

  currentConversation.value = {
    ...currentConversation.value,
    participants: [...currentConversation.value.participants, user]
  }

  await updateConversation({
    conversationId: currentConversation.value.conversationId,
    newUser: user,
    shareOldMessages: false
  })
}

const getUserConversations = async (userId: string) => {
  conversations.value = await loadUserConversations(userId)
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
    await getConversationHistory(conversationId)
  }
}

const sendMessage = async (value: string) => {
  if (!owner.value || !value) {
    return
  }
  if (!currentConversation.value) {
    return
  }
  console.log({
    fromId: owner.value.userId,
    toIds: currentConversation.value.participants.map((p) => p.userId),
    message: value,
    conversationId: currentConversation.value.conversationId ?? ''
  })
  await submitMessage({
    fromId: owner.value.userId,
    toIds: currentConversation.value.participants.map((p) => p.userId),
    message: value,
    conversationId: currentConversation.value.conversationId ?? ''
  })
}

const logOutUser = async () => {
  socket?.emit(
    'notification',
    JSON.stringify({
      participantIds: getParticipantIds(),
      userId: owner.value?.userId ?? '',
      online: false
    })
  )
  await logOut()
  router.push({ path: '/login' })
}

const getParticipantIds = () =>
  Array.from(
    new Set(
      conversations.value
        .map((conversation) => conversation.participants.map((p) => p.userId))
        .flat()
    )
  )

onMounted(async () => {
  const tokenPayload = await verifyToken()
  if (tokenPayload && tokenPayload.userId) {
    await findUserById(tokenPayload.userId)
  }

  if (!getUser || !getUser.loggedIn) {
    router.push({ path: '/login' })
    return
  }

  if (getUser.data && getUser.data) {
    owner.value = getUser.data as User
  }

  await getUserConversations(owner.value?.userId ?? '')
  // await notifyParticipants({
  //   participantIds: getParticipantIds(),
  //   userId: owner.value?.userId ?? '',
  //   online: true
  // })

  // {
  //   participantIds: getParticipantIds(),
  //   userId: owner.value?.userId ?? '',
  //   online: true
  // }

  socket = io(import.meta.env.VITE_SERVICE_URL, {
    query: { userId: owner.value?.userId }
  })

  socket.on('connect', () => {
    console.log('Successfully connected to the server')
    console.log('Client socket ID is', socket?.id)
    socket?.emit(
      'notification',
      JSON.stringify({
        participantIds: getParticipantIds(),
        userId: owner.value?.userId ?? '',
        online: true
      })
    )
  })

  socket.on('message', (message: string) => {
    const msgAsObject = JSON.parse(message)
    console.log(msgAsObject)
    // JSON.stringify({
    //       message: data.message,
    //       from: {
    //         userId: messageAuthor?.userId,
    //         name: messageAuthor?.name,
    //         online: messageAuthor?.online,
    //       },
    //       createdAt: data.createdAt,
    //       messageId: data.messageId,
    //       conversationId: data.conversationId,
    //       participants: data.participantUsers,
    //     }),
    if (
      msgAsObject.conversationId === currentConversation.value?.conversationId ||
      (!currentConversation.value?.conversationId &&
        currentConversation.value?.participants &&
        owner.value?.userId === msgAsObject.from.userId)
    ) {
      messages.value = [
        ...messages.value,
        {
          messageId: msgAsObject.messageId,
          message: msgAsObject.message,
          createdAt: msgAsObject.createdAt,
          author: {
            name: msgAsObject.from.name,
            userId: msgAsObject.from.userId,
            online: msgAsObject.from.online
          }
        }
      ]
      if (!currentConversation.value?.conversationId) {
        currentConversation.value = {
          conversationId: msgAsObject.conversationId,
          participants: msgAsObject.participants, //[...(currentConversation.value?.participants || []), msgAsObject.from],
          newMessage: false
        }

        conversations.value = [...conversations.value, currentConversation.value]
      }

      updateConversationMessages(msgAsObject.conversationId, owner.value?.userId ?? '')
      return
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
          participants: msgAsObject.participants, // [msgAsObject.from],
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

  socket.on('typing', (message: string) => {
    const data = JSON.parse(message)
    if (
      data.userId !== owner.value?.userId &&
      currentConversation.value?.conversationId === data.conversationId &&
      currentConversation.value?.participants.find((p) => p.userId === data.userId)
    ) {
      if (data.typing === 'typing' && !typing.value.includes(data.user)) {
        typing.value = [...typing.value, data.user]
      }
      if (data.typing === 'stop' && typing.value.includes(data.user)) {
        typing.value = typing.value.filter((user) => user !== data.user)
      }
    }
  })

  socket.on('user-online-status', (message: string) => {
    const msgAsObject = JSON.parse(message)
    currentConversation.value?.participants.forEach((participant) => {
      if (participant.userId === msgAsObject.userId) {
        participant.online = msgAsObject.online
      }
    })
    conversations.value.forEach((conversation) => {
      conversation.participants.forEach((participant) => {
        if (participant.userId === msgAsObject.userId) {
          participant.online = msgAsObject.online
        }
      })
    })
    messages.value.forEach((message) => {
      if (message.author.userId === msgAsObject.userId) {
        message.author.online = msgAsObject.online
      }
    })
  })

  socket.on('join-conversation', (message: string) => {
    const data = JSON.parse(message)
    conversations.value = [
      ...conversations.value,
      {
        conversationId: data.conversationId,
        participants: data.participants,
        newMessage: true
      }
    ]
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
      <div class="flex-1">
        <Conversations :conversations="conversations" @select-conversation="selectConversation" />
      </div>

      <!-- Logout button -->
      <button
        class="bg-slate-950 text-white font-bold py-2 px-3 rounded-md w-20"
        @click="logOutUser"
      >
        Logout
      </button>
    </div>

    <div class="flex-1 p-2 flex flex-col">
      <SearchInput v-if="currentConversation" @select-user="addNewUserToChat" />
      <div class="">
        To
        <span v-for="participant in currentConversation?.participants" class="mr-1">
          <ConversationParticipant :participant="participant" />
          <!-- <span
            class="rounded-full h-3 w-3 inline-block mr-1"
            :class="{ 'bg-emerald-600': participant.online, 'bg-red-600': !participant.online }"
          ></span>
          {{ participant.name }} -->
        </span>
      </div>

      <!-- History prev chat -->
      <Messages :messages="messages" />

      <!-- Our user name and status -->
      <div class="owner">From {{ owner?.name }}</div>

      <!-- Typing area -->
      <MessageInput
        :disabledSendButton="currentConversation?.participants?.length === 0"
        @send-message="sendMessage"
        @typing-message="typeMessage"
      />
      <p v-if="currentConversation" v-for="user in typing">
        <span>{{ user }} is typing... </span>
      </p>
    </div>
  </div>
</template>
