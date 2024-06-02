<script setup lang="ts">
import { onMounted } from 'vue'
import TheWelcome from '../components/TheWelcome.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { getUser } = useAuthStore()

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
