<script setup lang="ts">
import { submitMessage } from '@/services/conversationService'
import { useAuthStore } from '@/stores/auth'
import { getConversationParticipantIds } from '@/utils/get-participant-ids'
import { ref } from 'vue'
import { debounce } from '@/utils/debounce'
import { useSocketStore } from '@/stores/socket-store'
import { storeToRefs } from 'pinia'
import { useConversationStore } from '@/stores/conversation'

const { getUser } = useAuthStore()

const socketStore = useSocketStore()
const { emitTyping } = socketStore
const { typing } = storeToRefs(socketStore)

const conversationStore = useConversationStore()
const { getCurrentConversation } = storeToRefs(conversationStore)

const message = ref('')

const emitTypeMessage = debounce((value: string) => {
  if (getCurrentConversation.value && getUser.data?.userId) {
    emitTyping(value)
  }
})

const sendMessage = async () => {
  if (
    !getCurrentConversation.value ||
    getCurrentConversation.value.participants.length === 0 ||
    !getUser.data ||
    !message.value.trim()
  )
    return
  await submitMessage({
    fromId: getUser.data.userId,
    toIds: getConversationParticipantIds(getCurrentConversation.value),
    message: message.value,
    conversationId: getCurrentConversation.value.conversationId ?? ''
  })
  message.value = ''
  emitTypeMessage('stop')
}

const onChange = () => {
  emitTypeMessage('typing')
  if (message.value === '') {
    emitTypeMessage('stop')
  }
}
</script>

<template>
  <div class="flex flex-col p-2 pb-0 relative">
    <textarea
      class="message-input"
      rows="1"
      v-model="message"
      v-on:keydown="onChange"
      v-on:keyup.enter="sendMessage"
    />
    <font-awesome-icon
      icon="fa-regular fa-comment"
      class="absolute p-3 right-1 cursor-pointer w-5 h-5 text-slate-600"
      v-on:click="sendMessage"
    />
  </div>
  <div class="px-2 mb-1 min-h-[15px]">
    <div v-for="user in typing">
      <Transition name="fade" mode="out-in">
        <span v-show="getCurrentConversation" class="text-xs">{{ user }} is typing... </span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.message-input {
  @apply block resize-none mb-1 p-2 pr-3 border outline-none rounded-md border-slate-200 bg-slate-100;
}
</style>
