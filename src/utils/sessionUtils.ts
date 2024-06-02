import { createUserToken, verifyUserToken, deleteUserToken } from '@/services/authService'

export const createToken = async (userId: string) => {
  const userData = await createUserToken(userId)

  localStorage.setItem(
    import.meta.env.VITE_STORAGE_TOKEN,
    JSON.stringify({
      token: userData.token,
      userId: userId
    })
  )
}

export const verifyToken = async () => {
  const userData = localStorage.getItem(import.meta.env.VITE_STORAGE_TOKEN)

  if (!userData) {
    return
  }
  try {
    const verifyResult = await verifyUserToken(JSON.parse(userData))
    return { ...verifyResult, userId: JSON.parse(userData).userId }
  } catch (error) {
    console.error(error)
  }
}

export const resetToken = async () => {
  const userData = localStorage.getItem(import.meta.env.VITE_STORAGE_TOKEN)

  if (!userData) {
    return
  }

  localStorage.removeItem(import.meta.env.VITE_STORAGE_TOKEN)

  await deleteUserToken(JSON.parse(userData).userId)
}
