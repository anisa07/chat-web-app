<script setup lang="ts">
import SearchInput from '@/components/SearchInput.vue'
import ConversationParticipant from '@/components/ConversationParticipant.vue'
import { storeToRefs } from 'pinia'
import { useConversationStore } from '@/stores/conversation'
import { useAuthStore } from '@/stores/auth'

const { getUser } = useAuthStore()
const conversationStore = useConversationStore()
const { getCurrentConversation } = storeToRefs(conversationStore)
const { addNewUserToChat } = conversationStore
</script>

<template>
  <div class="flex flex-col py-2 px-4">
    <div class="flex justify-between">
      <p class="text-lg font-semibold">Messages</p>
      <SearchInput v-if="getCurrentConversation" @select-user="addNewUserToChat" />
    </div>
    <div>
      <span v-for="participant in getCurrentConversation?.participants">
        <span v-if="getUser.data?.userId !== participant.userId" class="mr-2">
          <ConversationParticipant :participant="participant" />
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped></style>
