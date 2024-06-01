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
import firebase from 'firebase/compat/app'

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

// // As httpOnly cookies are to be used, do not persist any state client side.
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

const app = createApp(App)

app.use(plugin, defaultConfig)
app.use(createPinia())
app.use(router)

app.mount('#app')
