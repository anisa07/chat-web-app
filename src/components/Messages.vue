<script setup lang="ts">
import type { ArchiveMessage } from '@/types/app-types'
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { throttle } from '@/utils/trottle'

const props = defineProps<{
  messages: ArchiveMessage[]
}>()

const emit = defineEmits(['load-more-messages'])

const { getUser } = useAuthStore()
const containerRef = ref<null | HTMLDivElement>(null)
const ulRef = ref<null | HTMLUListElement>(null)
const isAuthor = (msg: ArchiveMessage) => getUser.data?.userId === msg.author.userId

const handleScrollTop = () => {
  // Check if the user is scrolling up
  if (containerRef?.value && containerRef.value.scrollTop < containerRef.value.scrollHeight) {
    emit('load-more-messages')
  }
}

const throttledScrollTop = throttle(handleScrollTop, 1000)

// Function to scroll to the bottom
const scrollToBottom = () => {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  })
}

// Watch for changes in messages prop
watch(
  () => props.messages,
  (newVal, oldVal) => {
    if (newVal.length !== oldVal.length) {
      scrollToBottom()
    }
  },
  { deep: true }
)

// Also scroll to bottom on initial mount
onMounted(() => {
  scrollToBottom()
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', throttledScrollTop)
  }
})

onBeforeUnmount(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', throttledScrollTop)
  }
})
</script>

<template>
  <div ref="containerRef" class="flex-1 p-2 overflow-auto bg-slate-50">
    <ul ref="ulRef" class="flex flex-col justify-end">
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
