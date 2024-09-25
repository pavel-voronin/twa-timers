<template>
  <div class="space-y-1">
    <div @click="$refs.field.focus()" class="select-none text-sm font-semibold text-gray-500">{{ label }}</div>
    <input type="number" ref="field" v-bind="$attrs"
      class="text-lg font-semibold outline-none ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full resize-none"
      v-model="model"></input>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ label: string }>()
const model = defineModel()
</script>
