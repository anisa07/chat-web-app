import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/main'
import {
  createUser,
  getUser
  // findUsers
  // submitMessage,
  // loadUserConversations,
  // loadConversationMessages
} from '@/services/userService'
import type { UserData } from '@/types/UserData'
import type { UserAccount } from '@/types/UserAccount'
import { createToken } from '@/utils/sessionUtils'

// export const useCounterStore = defineStore('chatStore', () => {
//   const count = ref(0)
//   const doubleCount = computed(() => count.value * 2)
//   function increment() {
//     count.value++
//   }
//   const user = {
//     loggedIn: false,
//     data: null
//   }

//   return { count, doubleCount, increment }
// })

// export const useChatStore = defineStore('chat', {
//   state: {
// user: {
//   loggedIn: false,
//   data: null
// }
//   },
//   getters: {
// user(state){
//   return state.user
// }
//   }
// })

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
        await createUser({ name, userId: response.user.uid })
        // TODO create normal session in browser using response
        console.log('Register Response', response)
        await createToken(response.user.uid)
        this.setUser({ name, userId: response.user.uid })
        this.setLoggedInState(true)
      } else {
        throw new Error('Unable to register user')
      }
    },
    async login({ email, password }: { email: string; password: string }) {
      const response = await signInWithEmailAndPassword(auth, email, password)
      if (response) {
        // TODO create normal session in browser using response
        console.log('Login Response', response)
        const user = await getUser(response.user.uid)
        await createToken(response.user.uid)
        this.setUser(user)
        this.setLoggedInState(true)
      } else {
        throw new Error('login failed')
      }
    }
    // async logOut(context) {
    //   await signOut(auth)
    //   context.commit('SET_USER', null)
    // },
    // async fetchUser(context, user) {
    //   context.commit('SET_LOGGED_IN', user !== null)
    //   if (user) {
    //     context.commit('SET_USER', {
    //       displayName: user.displayName,
    //       email: user.email
    //     })
    //   } else {
    //     context.commit('SET_USER', null)
    //   }
    // }
  }
})
