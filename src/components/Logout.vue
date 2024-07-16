<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useConversationStore } from '@/stores/conversation'
import { useMessageStore } from '@/stores/message'
import { useSocketStore } from '@/stores/socket-store'
import { useRouter } from 'vue-router'

const router = useRouter()
const { logOut } = useAuthStore()
const { setConversations, setConversationsCount, setCurrentConversation } = useConversationStore()
const { setMessages, setMessagesCount } = useMessageStore()
const { logoutSocketUser } = useSocketStore()

const logOutUser = async () => {
  logoutSocketUser()
  setConversations([])
  setConversationsCount(0)
  setCurrentConversation(null)
  setMessages([])
  setMessagesCount(0)
  await logOut()
  router.push({ path: '/login' })
}
</script>

<template>
  <button class="bg-slate-950 text-white font-bold py-2 px-3 rounded-md w-20" @click="logOutUser">
    Logout
  </button>
</template>

<style scoped></style>
