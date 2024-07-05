<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formInputClasses, submitButtonClasses, formClasses } from '../styles/styles'
import { useRouter } from 'vue-router'
import { verifyToken } from '@/utils/sessionUtils'
import AuthWrapper from '@/components/AuthWrapper.vue'

const router = useRouter()
const { login, getUser, findUserById } = useAuthStore()
const submitted = ref(false)
const submitError = ref<string | null>(null)
const handleSubmit = async (v: { email: string; password: string }) => {
  try {
    await login(v)
    submitted.value = true
    router.push({ path: '/' })
  } catch (e: unknown) {
    if (e instanceof Error) {
      return (submitError.value = e.message)
    }
    submitError.value = typeof e === 'string' ? e : 'Unexpected error occurred.'
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
  <AuthWrapper>
    <div class="py-16 px-6">
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
        <h1 class="text-2xl font-bold mb-2 text-center">Login</h1>
        <FormKit
          type="text"
          name="email"
          label="Email"
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
            placeholder="*******"
            :classes="formInputClasses"
          />
        </div>

        <FormKit type="submit" label="Login" :classes="submitButtonClasses" />
      </FormKit>
      <p>
        No account?
        <router-link class="underline text-pink-700" to="/register">Register here.</router-link>
      </p>
    </div>
    <div v-if="submitError">
      <h2 class="text-lg text-red-500 px-6">{{ submitError }}</h2>
    </div>
  </AuthWrapper>
</template>
