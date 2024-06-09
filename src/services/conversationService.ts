import type { Message } from '@/types/Message'
import axios from 'axios'

const url = import.meta.env.VITE_SERVICE_URL

export const submitMessage = (message: Message) => {
  console.log(`${url}/archive`)
  return axios.post(`${url}/archive`, message)
}

export const loadUserConversations = (userId: string) =>
  axios.get(`${url}/archive/${userId}`).then((response) => response.data)

export const loadConversationMessages = (userId: string, coversationId: string) =>
  axios
    .get(`${url}/archive/coversation/${userId}/${coversationId}`)
    .then((response) => response.data)

export const updateConversationMessages = (coversationId: string, userId: string) =>
  axios
    .put(`${url}/archive/coversation/${coversationId}`, { userId })
    .then((response) => response.data)

// export const notifyParticipants = (data: {
//   userId: string
//   online: boolean
//   participantIds: string[]
// }) => axios.post(`${url}/archive/notify-participants`, data).then((response) => response.data)
