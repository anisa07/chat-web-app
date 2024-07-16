import type { ArchiveMessage } from '@/types/app-types'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import {
  loadConversationMessages,
  updateConversationMessages
} from '@/services/conversationService'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: [] as ArchiveMessage[],
    messagesCount: 0
  }),
  getters: {
    getMessages(state) {
      return state.messages
    },
    getMessagesCount(state) {
      return state.messagesCount
    }
  },
  actions: {
    setMessages(messages: ArchiveMessage[]) {
      this.messages = messages
    },
    setMessagesCount(count: number) {
      this.messagesCount = count
    },
    async getConversationHistory(conversationId: string, date: Date) {
      const { getUser } = useAuthStore()
      const userId = getUser.data?.userId
      if (!conversationId || !userId) {
        return
      }
      const { messages: conversationMessages, messagesCount: messagesLength } =
        await loadConversationMessages(userId, conversationId, date.toString())
      const sortedMessages = conversationMessages.sort(
        (a: ArchiveMessage, b: ArchiveMessage) =>
          new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf()
      )

      this.setMessages([...sortedMessages, ...this.messages])
      this.setMessagesCount(messagesLength)
      await updateConversationMessages(conversationId, userId)
    }
  }
})
