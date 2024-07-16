<script setup lang="ts">
import ConversationParticipant from '@/components/ConversationParticipant.vue'
import { useAuthStore } from '@/stores/auth'
import { useConversationStore } from '@/stores/conversation'
import { storeToRefs } from 'pinia'

const userAuthStore = useAuthStore()
const { getUser } = storeToRefs(userAuthStore)

const conversationStore = useConversationStore()
const { getConversations, getConversationsCount, getCurrentConversation } =
  storeToRefs(conversationStore)
const { getUserConversations, selectConversation } = conversationStore

const loadMoreConversations = async () => {
  if (!getUser.value.data?.userId) {
    return
  }
  const lastConversation = getConversations.value[getConversations.value.length - 1]
  await getUserConversations(
    getUser.value.data.userId,
    lastConversation.createdAt ? new Date(lastConversation.createdAt) : new Date()
  )
}
</script>

<template>
  <div class="flex-1">
    <p class="text-lg font-semibold" v-if="getConversations.length">Recently contacted</p>
    <TransitionGroup name="chats" tag="ul">
      <li
        v-for="conversation in getConversations"
        @click="selectConversation(conversation.conversationId)"
        class="cursor-pointer font-normal p-2 hover:bg-gray-100 rounded-md"
        :class="{
          'bg-gray-200': conversation.conversationId === getCurrentConversation?.conversationId,
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
    </TransitionGroup>
    <a
      v-if="getConversationsCount > getConversations.length"
      class="text-slate-950 font-bold py-2 px-2 rounded-md w-20 cursor-pointer"
      @click="loadMoreConversations"
    >
      Load more ...
    </a>
  </div>
</template>

<style scoped>
.chats-enter-active,
.chats-leave-active {
  transition: all 0.5s ease;
}

.chats-enter-from,
.chats-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
