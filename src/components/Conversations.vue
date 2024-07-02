<script setup lang="ts">
import type { Conversation } from '@/types/app-types'
import ConversationParticipant from '@/components/ConversationParticipant.vue'
import { useAuthStore } from '@/stores/auth'

defineProps<{
  conversations: Conversation[]
  currentConversationId: string | undefined
}>()

const emit = defineEmits(['select-conversation'])

const selectConversation = (userId: string) => {
  emit('select-conversation', userId)
}

const { getUser } = useAuthStore()
</script>

<template>
  <ul class="chats">
    <li
      v-for="conversation in conversations"
      @click="selectConversation(conversation.conversationId)"
      class="cursor-pointer font-normal p-2 hover:bg-gray-100 rounded-md"
      :class="{
        'bg-gray-200': conversation.conversationId === currentConversationId,
        'font-bold': conversation.newMessage
      }"
      :key="conversation.conversationId"
    >
      <template v-for="participant in conversation.participants" :key="participant.userId">
        <span v-if="getUser.data?.userId !== participant.userId" class="mr-2">
          <ConversationParticipant :participant="participant" />
        </span>
      </template>
    </li>
  </ul>
</template>

<style scoped></style>
