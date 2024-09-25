<template>
  <div class="space-y-1">
    <div @click="$refs.field.focus()" class="select-none text-sm font-semibold text-gray-500">{{ label }}</div>
    <div ref="field"
      class="text-lg font-semibold outline-none ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full resize-none"
      contenteditable="true" @input="$emit('update:modelValue', ($event.target! as Element).textContent as string)">{{
        modelValue
      }}</div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{ modelValue: string, label: string }>()
defineEmits<{ 'update:modelValue': [string] }>()
</script>
