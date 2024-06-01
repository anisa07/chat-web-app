<script setup lang="ts">
import { onMounted } from 'vue'
import TheWelcome from '../components/TheWelcome.vue'
import { useChatStore } from '@/stores/chat'
import { useRouter } from 'vue-router'

const router = useRouter()
const { getUser } = useChatStore()

onMounted(() => {
  if (!getUser.loggedIn) {
    router.push({ path: '/login' })
  }
})
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
