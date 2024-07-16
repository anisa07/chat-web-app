import type { Message } from '@/types/Message'
import axios from 'axios'

const url = import.meta.env.VITE_SERVICE_URL

export const submitMessage = (message: Message) => {
  return axios.post(`${url}/archive`, message)
}

export const loadUserConversations = (userId: string, date: string | number) =>
  axios.get(`${url}/archive/${userId}/${date}`).then((response) => response.data)

export const loadConversationMessages = (userId: string, coversationId: string, date: string) =>
  axios
    .get(`${url}/archive/coversation/${userId}/${coversationId}/${date}`)
    .then((response) => response.data)

export const updateConversationMessages = (coversationId: string, userId: string) =>
  axios
    .put(`${url}/archive/coversation/${coversationId}/messages`, { userId })
    .then((response) => response.data)

export const updateConversation = (conversation: {
  conversationId: string
  newUser: { userId: string; name: string }
  shareOldMessages: boolean
}) => {
  axios
    .put(`${url}/archive/coversation/${conversation.conversationId}`, conversation)
    .then((response) => response.data)
}

export const checkNewUserConversationAlreadyExists = (currentUserId: string, newUserId: string) =>
  axios
    .get(`${url}/archive/new-coversation/${currentUserId}/${newUserId}`)
    .then((response) => response.data)
