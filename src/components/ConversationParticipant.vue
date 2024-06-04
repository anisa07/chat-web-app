<script setup lang="ts">
import type { User } from '@/types/app-types'

defineProps<{
  participant: User
}>()
</script>

<template>
  <span
    class="rounded-full h-3 w-3 inline-block mr-1"
    :class="{ 'bg-emerald-600': participant.online, 'bg-red-600': !participant.online }"
  ></span>
  {{ participant.name }}
</template>

<style scoped></style>
