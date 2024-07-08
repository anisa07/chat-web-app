<script setup lang="ts">
import type { ArchiveMessage } from '@/types/app-types'
import { useAuthStore } from '@/stores/auth'

defineProps<{
  messages: ArchiveMessage[]
}>()

const { getUser } = useAuthStore()

const isAuthor = (msg: ArchiveMessage) => getUser.data?.userId === msg.author.userId
</script>

<template>
  <div class="flex-1 p-2 overflow-auto bg-slate-50">
    <ul class="flex flex-col">
      <li
        v-for="msg in messages"
        class="mb-2 w-2/3"
        :key="msg.messageId"
        :class="{ 'self-end': isAuthor(msg) }"
      >
        <div
          class="p-2 rounded-md"
          :class="{
            'bg-violet-600': isAuthor(msg),
            'bg-slate-200': !isAuthor(msg),
            'text-white': isAuthor(msg)
          }"
        >
          {{ msg.message }}
        </div>
        <div class="text-slate-500">
          <span class="font-semibold text-xs">
            {{ msg.author.name }}
          </span>
          -
          <span class="text-xs">{{ new Date(msg.createdAt).toLocaleString() }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
