<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  disabledSendButton: boolean
}>()

const emit = defineEmits(['send-message', 'typing-message'])
const message = ref('')

const sendMessage = () => {
  if (props.disabledSendButton) return
  emit('send-message', message.value)
  message.value = ''
  emit('typing-message', 'stop')
}

const onChange = () => {
  emit('typing-message', 'typing')
  if (message.value === '') {
    emit('typing-message', 'stop')
  }
}
</script>

<template>
  <div class="flex flex-col p-2 relative">
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
</template>

<style scoped>
.message-input {
  @apply block resize-none mb-1 p-2 pr-3 border outline-none rounded-md border-slate-200 bg-slate-100;
}
</style>
