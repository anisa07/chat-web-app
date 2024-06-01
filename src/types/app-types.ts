export interface User {
  name: string
  userId: string
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
