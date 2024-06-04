<script setup lang="ts">
import type { Conversation } from '@/types/app-types'
import ConversationParticipant from '@/components/ConversationParticipant.vue'

defineProps<{
  conversations: Conversation[]
}>()

const emit = defineEmits(['select-conversation'])

const selectConversation = (userId: string) => {
  emit('select-conversation', userId)
}
</script>

<template>
  <p v-if="conversations.length > 0">Existing chats</p>
  <ul class="chats">
    <li
      v-for="conversation in conversations"
      @click="selectConversation(conversation.conversationId)"
      v-bind:style="[conversation.newMessage ? { fontWeight: 'bold' } : { fontWeight: 'normal' }]"
    >
      <span v-for="participant in conversation.participants" class="mr-1">
        <ConversationParticipant :participant="participant" />
      </span>
    </li>
  </ul>
</template>

<style scoped></style>
