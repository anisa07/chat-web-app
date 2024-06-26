import { verifyUserToken } from '@/services/authService'

export const createToken = async (userId: string, token: string) => {
  localStorage.setItem(
    import.meta.env.VITE_STORAGE_TOKEN,
    JSON.stringify({
      token,
      userId
    })
  )
}

export const verifyToken = async () => {
  const userData = localStorage.getItem(import.meta.env.VITE_STORAGE_TOKEN)

  if (!userData) {
    return
  }
  try {
    await verifyUserToken()
    return { userId: JSON.parse(userData).userId }
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
}
