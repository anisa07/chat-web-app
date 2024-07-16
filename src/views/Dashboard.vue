<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import type { User } from '@/types/app-types'
import MessageInput from '@/components/MessageInput.vue'
import SearchInput from '@/components/SearchInput.vue'
import Conversations from '@/components/Conversations.vue'
import Messages from '@/components/Messages.vue'
import Logout from '@/components/Logout.vue'
import { verifyToken } from '@/utils/sessionUtils'
import { useConversationStore } from '@/stores/conversation'
import { useSocketStore } from '@/stores/socket-store'
import MessageHeader from '@/components/MessageHeader.vue'

const router = useRouter()
const { getUser, findUserById } = useAuthStore()

const conversationStore = useConversationStore()
const { getUserConversations, selectUserToChat } = conversationStore

const socketStore = useSocketStore()
const { initSocket, setupListeners, disconnectSocket } = socketStore

const owner = ref<User | null>(null)

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

  await getUserConversations(owner.value?.userId ?? '', new Date())

  initSocket()

  setupListeners()
})

onBeforeUnmount(() => {
  disconnectSocket()
})
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-col gap-4 px-4 py-2 border-r border-r-slate-300">
      <div>
        <p class="text-lg font-semibold">Chat</p>
        <SearchInput @select-user="selectUserToChat" />
      </div>

      <!-- List of user's chats -->
      <Conversations />

      <!-- Logout button -->
      <Logout />
    </div>

    <div class="flex-1 flex flex-col">
      <MessageHeader />

      <!-- History prev chat -->
      <Messages />

      <!-- Typing area -->
      <MessageInput />
    </div>
  </div>
</template>
