import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { useAuthStore } from './auth'
import { useConversationStore } from './conversation'
import { getAllParticipantIds, getConversationParticipantIds } from '@/utils/get-participant-ids'
import type { Conversation } from '@/types/app-types'
import { useMessageStore } from './message'
import { updateConversationMessages } from '@/services/conversationService'

export const useSocketStore = defineStore('socket-store', {
  state: () => ({
    socket: null as any | null,
    typing: [] as string[]
  }),
  getters: {
    getSocket(state) {
      return state.socket
    },
    getTyping(state) {
      return state.typing
    }
  },
  actions: {
    setTyping(typing: string[]) {
      this.typing = typing
    },
    initSocket() {
      const { getUser } = useAuthStore()
      this.socket = io(import.meta.env.VITE_SERVICE_URL, {
        query: { userId: getUser.data?.userId }
      })
    },
    setupListeners() {
      this.socket.on('connect', () => {
        const { getConversations } = useConversationStore()
        const { getUser } = useAuthStore()
        this.socket?.emit(
          'notification',
          JSON.stringify({
            participantIds: getAllParticipantIds(getConversations),
            userId: getUser.data?.userId,
            online: true
          })
        )
      })
      this.socket.on('connect_error', () => {
        setTimeout(() => {
          this.socket?.connect()
        }, 1000)
        console.log('error with connection ....')
      })
      this.socket.on('disconnect', () => {
        const { getConversations } = useConversationStore()
        const { getUser } = useAuthStore()
        this.socket?.emit(
          'notification',
          JSON.stringify({
            participantIds: getAllParticipantIds(getConversations),
            userId: getUser.data?.userId,
            online: false
          })
        )
      })
      this.socket.on('join-conversation', (message: string) => {
        const { getConversations, setConversations } = useConversationStore()
        const data = JSON.parse(message)
        const copy = [...getConversations]
        setConversations([
          ...copy,
          {
            conversationId: data.conversationId,
            participants: data.participants,
            newMessage: true,
            createdAt: ''
          }
        ])
      })
      this.socket.on('typing', (message: string) => {
        const { getCurrentConversation } = useConversationStore()
        const { getUser } = useAuthStore()
        const data = JSON.parse(message)
        if (
          data.userId !== getUser.data?.userId &&
          getCurrentConversation?.conversationId === data.conversationId &&
          getCurrentConversation?.participants.find((p) => p.userId === data.userId)
        ) {
          if (data.typing === 'typing' && !this.typing.includes(data.user)) {
            this.setTyping([...this.typing, data.user])
          }
          if (data.typing === 'stop' && this.typing.includes(data.user)) {
            this.setTyping(this.typing.filter((user) => user !== data.user))
          }
        }
      })
      this.socket.on('user-online-status', (message: string) => {
        const {
          getCurrentConversation,
          getConversations,
          setCurrentConversation,
          setConversations
        } = useConversationStore()
        const { getMessages, setMessages } = useMessageStore()
        const msgAsObject = JSON.parse(message)
        const copyCurrentConversation = { ...getCurrentConversation }
        if (copyCurrentConversation?.participants) {
          copyCurrentConversation.participants.forEach((participant) => {
            if (participant.userId === msgAsObject.userId) {
              participant.online = msgAsObject.online
            }
          })
          setCurrentConversation(copyCurrentConversation as Conversation)
        }
        const copy = [...getConversations]
        copy.forEach((conversation) => {
          conversation.participants.forEach((participant) => {
            if (participant.userId === msgAsObject.userId) {
              participant.online = msgAsObject.online
            }
          })
        })
        setConversations(copy)
        const messages = [...getMessages]
        messages.forEach((message) => {
          if (message.author.userId === msgAsObject.userId) {
            message.author.online = msgAsObject.online
          }
        })
        setMessages(messages)
      })
      this.socket.on('message', (message: string) => {
        const {
          getCurrentConversation,
          getConversations,
          setCurrentConversation,
          setConversations
        } = useConversationStore()
        const { getUser } = useAuthStore()
        const { getMessages, setMessages, setMessagesCount, getMessagesCount } = useMessageStore()
        const msgAsObject = JSON.parse(message)
        if (
          msgAsObject.conversationId === getCurrentConversation?.conversationId ||
          (!getCurrentConversation?.conversationId &&
            getCurrentConversation?.participants &&
            getUser.data?.userId === msgAsObject.from.userId)
        ) {
          setMessages([
            ...getMessages,
            {
              messageId: msgAsObject.messageId,
              message: msgAsObject.message,
              createdAt: msgAsObject.createdAt,
              author: {
                name: msgAsObject.from.name,
                userId: msgAsObject.from.userId,
                online: msgAsObject.from.online
              }
            }
          ])

          setMessagesCount(getMessagesCount + 1)
          if (!getCurrentConversation?.conversationId) {
            setCurrentConversation({
              conversationId: msgAsObject.conversationId,
              participants: msgAsObject.participants,
              newMessage: false,
              createdAt: msgAsObject.createdAt
            })

            setConversations([
              ...getConversations,
              {
                conversationId: msgAsObject.conversationId,
                participants: msgAsObject.participants,
                newMessage: false,
                createdAt: msgAsObject.createdAt
              }
            ])
          }

          updateConversationMessages(msgAsObject.conversationId, getUser.data?.userId ?? '')
          return
        }
        const copy = [...getConversations]
        const conversationIndex = copy.findIndex(
          (chat) => chat.conversationId === msgAsObject.conversationId
        )
        if (conversationIndex === -1) {
          const newMessage = getCurrentConversation?.conversationId !== msgAsObject.conversationId
          setConversations([
            ...copy,
            {
              conversationId: msgAsObject.conversationId,
              participants: msgAsObject.participants,
              newMessage,
              createdAt: msgAsObject.createdAt
            }
          ])
        } else {
          copy[conversationIndex] = {
            ...copy[conversationIndex],
            newMessage: true
          }
          setConversations(copy)
        }
      })
    },
    logoutSocketUser() {
      const { getConversations } = useConversationStore()
      const { getUser } = useAuthStore()
      this.socket?.emit(
        'notification',
        JSON.stringify({
          participantIds: getAllParticipantIds(getConversations),
          userId: getUser.data?.userId ?? '',
          online: false
        })
      )
    },
    disconnectSocket() {
      this.socket?.disconnect()
    },
    emitTyping(value: string) {
      const { getCurrentConversation } = useConversationStore()
      const { getUser } = useAuthStore()
      this.socket.emit(
        'user-typing',
        JSON.stringify({
          conversationId: getCurrentConversation?.conversationId,
          participantIds: getConversationParticipantIds(getCurrentConversation as Conversation),
          user: getUser.data?.name,
          userId: getUser.data?.userId,
          typing: value
        })
      )
    }
  }
})
