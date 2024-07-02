<script setup lang="ts">
import type { User } from '@/types/app-types'

defineProps<{
  participant: User
}>()
</script>

<template>
  <span>
    <span
      class="rounded-full h-2 w-2 inline-block"
      :class="{ 'bg-emerald-600': participant.online, 'bg-red-600': !participant.online }"
    ></span>
    {{ participant.name }}
  </span>
</template>

<style scoped></style>
