<template>
  <div @click="">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
document.body.classList.add('bg-gray-50')

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, user-scalable=no' }
  ],
})
</script>