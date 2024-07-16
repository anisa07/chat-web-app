<script setup lang="ts"></script>

<template>
  <Transition>
    <div class="auth-outer-container">
      <div class="auth-inner-container anim-appearance">
        <div class="auth-form-wrapper">
          <slot></slot>
        </div>
        <img src="@/assets/chat-img3.png" alt="auth" class="auth-image" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@keyframes appearance {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.anim-appearance {
  animation-name: appearance;
  animation-duration: 1s;
  animation-timing-function: ease;
}
</style>
