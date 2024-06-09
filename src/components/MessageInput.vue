<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  disabledSendButton: boolean
}>()

const emit = defineEmits(['send-message', 'typing-message'])
const message = ref('')

const sendMessage = () => {
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
  <div class="flex flex-col">
    <textarea
      class="block resize-none mb-1 p-2 border border-slate-950"
      rows="5"
      v-model="message"
      v-on:keydown="onChange"
    />
    <button
      :disabled="disabledSendButton"
      class="bg-pink-600 text-white font-bold py-2 px-3 rounded-md w-44"
      @click="sendMessage"
    >
      Send
    </button>
  </div>
</template>

<style scoped></style>
