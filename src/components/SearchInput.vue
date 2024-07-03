<script setup lang="ts">
import { ref, watch } from 'vue'
import { findUserByName } from '@/services/userService'
import type { User } from '@/types/app-types'
import { debounce } from '../utils/debounce'
import { onClickOutside } from '@vueuse/core'

const target = ref(null)
const emit = defineEmits(['select-user'])
const search = ref('')
const users = ref<User[]>([])

const searchUsers = async () => {
  const response = await findUserByName(search.value)
  users.value = response ?? []
}

const selectUserToChat = (user: User) => {
  emit('select-user', user)
  users.value = []
  search.value = ''
}

const debouncedFetch = debounce((newValue: string) => {
  searchUsers()
}, 300)

watch(search, async (value) => {
  debouncedFetch(value)
})

onClickOutside(target, () => {
  users.value = []
  search.value = ''
})
</script>

<template>
  <div class="search-block flex relative" ref="target">
    <font-awesome-icon icon="fa-regular fa-user" class="search-icon" />
    <input
      type="text"
      placeholder="Search a user..."
      class="search-input"
      v-model.capitalize="search"
    />

    <ul class="search-list" v-show="users.length">
      <li
        v-for="user in users"
        @click="selectUserToChat(user)"
        class="mb-1 cursor-pointer hover:bg-gray-100"
      >
        <span class="px-2 py-1">
          {{ user.name }}
        </span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.search-icon {
  @apply p-2 border border-r-0 border-slate-200 bg-slate-100 rounded-tl-md rounded-bl-md text-slate-600;
}

.search-input {
  @apply p-1 border border-l-0 border-slate-200 outline-none bg-slate-100 rounded-tr-md rounded-br-md;
}

.search-list {
  @apply mb-4 absolute top-8 right-0 left-0 bg-white border border-slate-200 rounded-md;
}
</style>
