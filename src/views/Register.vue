<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { formInputClasses, submitButtonClasses, formClasses } from '../styles/styles'
import { useRouter } from 'vue-router'
import { verifyToken } from '@/utils/sessionUtils'

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
  <div class="mx-auto mt-8 w-8/12 max-w-lg rounded-sm border-2 border-pink-600">
    <div class="p-4">
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
        <h1 class="text-2xl font-bold mb-2">Register!</h1>
        <FormKit
          type="text"
          name="name"
          label="Your name"
          placeholder="Melisandre"
          validation="required"
          :classes="formInputClasses"
        />
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
          <FormKit
            type="password"
            name="password_confirm"
            label="Confirm password"
            placeholder="Confirm password"
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
      <h2 class="text-xl text-red-500 p-4">{{ submitError }}</h2>
    </div>
  </div>
</template>
