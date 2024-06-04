export interface User {
  name: string
  userId: string
  online?: boolean
}

export interface ArchiveMessage {
  messageId: string
  message: string
  createdAt: string
  author: User
}

export interface Conversation {
  conversationId: string
  participants: User[]
  newMessage?: boolean
}
