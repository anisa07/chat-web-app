import type { Conversation } from '@/types/app-types'

export const getAllParticipantIds = (conversations: Conversation[]) =>
  Array.from(
    new Set(
      conversations.map((conversation) => conversation.participants.map((p) => p.userId)).flat()
    )
  )

export const getConversationParticipantIds = (conversation: Conversation) =>
  conversation.participants.map((p) => p.userId)
