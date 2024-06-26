import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { plugin, defaultConfig } from '@formkit/vue'
import './index.css'
import axios from 'axios'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
}

// Initialize Firebase
initializeApp(firebaseConfig)
export const auth = getAuth()

const app = createApp(App)
const url = import.meta.env.VITE_SERVICE_URL
app.use(plugin, defaultConfig)
app.use(createPinia())
app.use(router)

// Request interceptors
axios.interceptors.request.use(
  (config) => {
    // Do or set some things before the request is set
    const userData = localStorage.getItem(import.meta.env.VITE_STORAGE_TOKEN)
    const parsedData = { token: '', userId: '' }
    if (userData) {
      parsedData.token = JSON.parse(userData).token
      parsedData.userId = JSON.parse(userData).userId
    }
    // e.g. Authorization header
    config.headers['Authorization'] = `Bearer ${parsedData.token}`
    config.headers['userId'] = parsedData.userId || ''

    // e.g. Content-type
    config.headers['Content-Type'] = 'application/json'

    // e.g. set Base url
    config.baseURL = url

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

app.mount('#app')
