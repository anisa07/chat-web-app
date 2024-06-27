<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formInputClasses, submitButtonClasses, formClasses } from '../styles/styles'
import { useRouter } from 'vue-router'
import { verifyToken } from '@/utils/sessionUtils'
import AuthWrapper from '@/components/AuthWrapper.vue'

const router = useRouter()
const { register, getUser, findUserById } = useAuthStore()
const submitted = ref(false)
const submitError = ref(null)
const handleSubmit = async (v) => {
  try {
    await register(v)
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
  <AuthWrapper>
    <div class="px-6 pt-4">
      <FormKit
        type="form"
        id="registration-example"
        :form-class="submitted ? 'hide' : 'show'"
        submit-label="Register"
        @submit="handleSubmit"
        :actions="false"
        #default="{ value }"
        :config="{
          classes: formClasses
        }"
      >
        <h1 class="text-2xl font-bold mb-2 text-center">Register</h1>
        <FormKit
          type="text"
          name="name"
          label="Name"
          placeholder="Melisandre"
          validation="required"
          :classes="formInputClasses"
        />
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
          <FormKit
            type="password"
            name="password_confirm"
            label="Confirm password"
            placeholder="*******"
            validation="required|confirm"
            :classes="formInputClasses"
          />
        </div>

        <FormKit type="submit" label="Register" :classes="submitButtonClasses" />
      </FormKit>
      <p>
        Already registered?
        <router-link class="underline text-pink-600" to="/login">Just login here.</router-link>
      </p>
    </div>
    <div v-if="submitError">
      <h2 class="text-lg text-red-500 px-6">{{ submitError }}</h2>
    </div>
  </AuthWrapper>
</template>
