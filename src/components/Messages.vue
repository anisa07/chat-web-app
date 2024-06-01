<script setup lang="ts">
defineProps<{
  messages: ArchiveMessage[]
}>()
</script>

<template>
  <div class="flex-1 border border-slate-950 p-2">
    <ul>
      <li v-for="msg in messages" class="mb-2">
        <div>
          <span class="font-semibold">{{ msg.author.name }}</span> -
          <span class="text-xs">{{ new Date(msg.createdAt).toLocaleString() }}</span>
        </div>
        <div>
          {{ msg.message }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
