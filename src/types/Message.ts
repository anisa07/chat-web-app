export interface Message {
  message: string
  fromId: string // userId
  toIds: string[] // userId []
  conversationId: string
}
