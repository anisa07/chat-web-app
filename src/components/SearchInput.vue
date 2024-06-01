<script setup lang="ts">
import { ref } from 'vue'
import { findUserByName } from '@/services/userService'
import type { User } from '@/types/app-types'

const emit = defineEmits(['select-user'])
const search = ref('')
const users = ref<User[]>([])

const searchUsers = async () => {
  const response = await findUserByName(search.value)
  users.value = response.data ?? []
  search.value = ''
}

const selectUserToChat = (userId: string) => {
  emit('select-user', userId)
  users.value = []
}
</script>

<template>
  <div class="search-block">
    <input
      type="text"
      placeholder="Search a user..."
      class="p-1 mr-2 border border-slate-950"
      v-model="search"
    />
    <button
      class="bg-pink-600 text-white font-bold py-2 px-3 rounded-md w-auto"
      @click="searchUsers"
    >
      Search
    </button>
  </div>

  <ul class="mb-4">
    <li v-for="user in users" @click="selectUserToChat(user.userId)">{{ user.name }}</li>
  </ul>
</template>

<style scoped></style>
