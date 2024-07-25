import { defineStore } from 'pinia'
import type { Conversation, User } from '@/types/app-types'
import {
  checkNewUserConversationAlreadyExists,
  loadUserConversations,
  updateConversation
} from '@/services/conversationService'
import { useMessageStore } from './message'
import { useAuthStore } from './auth'

export const useConversationStore = defineStore('conversation', {
  state: () => ({
    conversations: [] as Conversation[],
    conversationsCount: 0,
    currentConversation: null as Conversation | null
  }),
  getters: {
    getConversations(state) {
      return state.conversations
    },
    getConversationsCount(state) {
      return state.conversationsCount
    },
    getCurrentConversation(state) {
      return state.currentConversation
    }
  },
  actions: {
    setConversations(conversations: Conversation[]) {
      this.conversations = conversations
    },
    setConversationsCount(count: number) {
      this.conversationsCount = count
    },
    setCurrentConversation(conversation: Conversation | null) {
      this.currentConversation = conversation
    },
    async getUserConversations(userId: string, date: Date) {
      const { conversations: userConversations, conversationsCount: conversationsLength } =
        await loadUserConversations(userId, date.toString())
      this.setConversations([...this.conversations, ...userConversations])
      this.setConversationsCount(conversationsLength)
    },
    async selectConversation(conversationId: string) {
      const { setMessagesCount, setMessages, getConversationHistory } = useMessageStore()
      setMessagesCount(0)
      setMessages([])
      const conversationIndex = this.conversations.findIndex(
        (chat) => chat.conversationId === conversationId
      )
      if (conversationIndex > -1) {
        const copy = [...this.conversations]
        copy[conversationIndex] = {
          ...copy[conversationIndex],
          newMessage: false
        }
        this.setConversations(copy)
        this.setCurrentConversation(this.conversations[conversationIndex])
        await getConversationHistory(conversationId, new Date())
      }
    },
    async selectUserToChat(user: User) {
      const { getUser } = useAuthStore()
      const { setMessagesCount, setMessages, getConversationHistory } = useMessageStore()
      setMessagesCount(0)
      setMessages([])

      // check if such conversation already exists in in database
      const existingConversation = await checkNewUserConversationAlreadyExists(
        getUser.data?.userId || '',
        user.userId
      )

      if (existingConversation) {
        this.setCurrentConversation(existingConversation)
        await getConversationHistory(existingConversation.conversationId ?? '', new Date())
      }
      if (!existingConversation) {
        this.setCurrentConversation({ conversationId: '', participants: [user], createdAt: '' })
      }
    },
    async addNewUserToChat(user: User) {
      const index = this.conversations.findIndex(
        (conversation) => conversation.conversationId === this.currentConversation?.conversationId
      )
      if (
        !this.currentConversation ||
        this.currentConversation.participants.find((p) => p.userId === user.userId) ||
        index === -1
      ) {
        return
      }

      const copy = [...this.conversations]

      copy[index] = {
        ...copy[index],
        participants: [...copy[index].participants, user]
      }

      this.setCurrentConversation({
        ...this.currentConversation,
        participants: [...this.currentConversation.participants, user]
      })

      await updateConversation({
        conversationId: this.currentConversation.conversationId,
        newUser: user,
        shareOldMessages: false
      })
    }
  }
})
