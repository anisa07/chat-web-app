<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formInputClasses, submitButtonClasses, formClasses } from '../styles/styles'
import { useRouter } from 'vue-router'
import { verifyToken } from '@/utils/sessionUtils'

const router = useRouter()
const { login, getUser, findUserById } = useAuthStore()
const submitted = ref(false)
const submitError = ref(null)
const handleSubmit = async (v) => {
  try {
    await login(v)
    submitted.value = true
    router.push({ path: '/' })
  } catch (e) {
    submitError.value = typeof e === 'string' ? e : e.message
    console.error(e)
  }
}

onMounted(async () => {
  const tokenPayload = await verifyToken()
  if (tokenPayload && tokenPayload.userId) {
    await findUserById(tokenPayload.userId)
  }

  if (getUser.loggedIn) {
    router.push({ path: '/' })
  }
})
</script>

<template>
  <div class="mx-auto mt-8 w-8/12 max-w-lg rounded-sm border-2 border-pink-600">
    <div class="p-4">
      <FormKit
        type="form"
        id="login-form"
        :form-class="submitted ? 'hide' : 'show'"
        submit-label="Login"
        @submit="handleSubmit"
        :actions="false"
        #default="{ value }"
        :config="{
          classes: formClasses
        }"
      >
        <h1 class="text-2xl font-bold mb-2">Login!</h1>
        <FormKit
          type="text"
          name="email"
          label="Your email"
          placeholder="red_woman@example.com"
          validation="required|email"
          :classes="formInputClasses"
        />
        <div class="double">
          <FormKit
            type="password"
            name="password"
            label="Password"
            validation="required|length:6|matches:/[^a-zA-Z]/"
            :validation-messages="{
              matches: 'Please include at least one symbol'
            }"
            placeholder="Your password"
            :classes="formInputClasses"
          />
        </div>

        <FormKit type="submit" label="Login" :classes="submitButtonClasses" />
      </FormKit>
      <p>
        No account?
        <router-link class="underline text-pink-600" to="/register">Register here.</router-link>
      </p>
    </div>
    <div v-if="submitError">
      <h2 class="text-xl text-red-500 p-4">{{ submitError }}</h2>
    </div>
  </div>
</template>
