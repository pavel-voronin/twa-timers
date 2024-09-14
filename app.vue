<template>
  <div @click="">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
document.body.classList.add('bg-white')
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, user-scalable=no' }
  ]
})
</script>