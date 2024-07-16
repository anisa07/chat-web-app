<script setup lang="ts">
import type { ArchiveMessage } from '@/types/app-types'
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { throttle } from '@/utils/trottle'
import { useConversationStore } from '@/stores/conversation'
import { useMessageStore } from '@/stores/message'
import { storeToRefs } from 'pinia'

const conversationStore = useConversationStore()
const { getCurrentConversation } = storeToRefs(conversationStore)

const messageStore = useMessageStore()
const { getMessages, getMessagesCount } = storeToRefs(messageStore)
const { getConversationHistory } = messageStore

const { getUser } = useAuthStore()
const containerRef = ref<null | HTMLDivElement>(null)
const ulRef = ref<null | HTMLUListElement>(null)
const isAuthor = (msg: ArchiveMessage) => getUser.data?.userId === msg.author.userId

const handleLoadMoreMessages = async () => {
  if (getMessagesCount.value > getMessages.value.length) {
    await getConversationHistory(
      getCurrentConversation.value?.conversationId ?? '',
      new Date(getMessages.value[0].createdAt)
    )
  }
}

const handleScrollTop = () => {
  // Check if the user is scrolling up
  if (containerRef?.value && containerRef.value.scrollTop < containerRef.value.scrollHeight) {
    handleLoadMoreMessages()
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
  () => getMessages.value,
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
    <!-- <ul ref="ulRef" class="flex flex-col justify-end"> -->
    <TransitionGroup ref="ulRef" name="messages" tag="ul" class="flex flex-col justify-end">
      <li
        v-for="msg in getMessages"
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
    </TransitionGroup>
    <!-- </ul> -->
  </div>
</template>

<style scoped>
.messages-enter-active,
.messages-leave-active {
  transition: all 0.5s ease;
}

.messages-enter-from,
.messages-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
