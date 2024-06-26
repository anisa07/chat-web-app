import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '@/main'
import { createUser, getUser, updateUser } from '@/services/userService'
import type { UserData } from '@/types/UserData'
import type { UserAccount } from '@/types/UserAccount'
import { createToken, resetToken } from '@/utils/sessionUtils'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      loggedIn: false,
      data: null as UserData | null
    }
  }),
  getters: {
    getUser(state) {
      return state.user
    }
  },
  actions: {
    setLoggedInState(loggedIn: boolean) {
      this.user.loggedIn = loggedIn
    },
    setUser(data: UserData | null) {
      this.user.data = data
    },
    async findUserById(userId: string) {
      const user = await getUser(userId)
      this.setUser(user)
      this.setLoggedInState(true)
    },
    async register({ email, password, name }: UserAccount) {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      if (response) {
        const token = await response.user.getIdToken()
        await createToken(response.user.uid, token)
        await createUser({ name, userId: response.user.uid, online: true })
        this.setUser({ name, userId: response.user.uid, online: true })
        this.setLoggedInState(true)
      } else {
        throw new Error('Unable to register user')
      }
    },
    async login({ email, password }: { email: string; password: string }) {
      const response = await signInWithEmailAndPassword(auth, email, password)
      if (response) {
        const userResponse = response.user
        const user = await getUser(userResponse.uid)
        const token = await userResponse.getIdToken()
        await createToken(userResponse.uid, token)
        await updateUser({ ...user, online: true })
        this.setUser(user)
        this.setLoggedInState(true)
      } else {
        throw new Error('login failed')
      }
    },
    async logOut() {
      await signOut(auth)
      await resetToken()
      if (this.user.data) {
        await updateUser({ ...this.user.data, online: false })
      }
      this.setUser(null)
      this.setLoggedInState(false)
    }
  }
})
