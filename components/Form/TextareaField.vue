<template>
  <div class="space-y-1">
    <div @click="focusField" class="select-none text-sm font-semibold text-gray-500">{{ label }}</div>
    <div ref="field"
      class="text-lg font-semibold outline-none ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full resize-none"
      contenteditable="true" @input="onInput"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onMounted } from 'vue';

const props = defineProps<{ modelValue: string, label: string }>();
const emit = defineEmits<{ 'update:modelValue': [string] }>();

const field = ref<HTMLElement | null>(null);

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLElement).textContent || '');
}

watch(() => props.modelValue, (val) => {
  if (field.value && field.value.textContent !== val) {
    field.value.textContent = val;
  }
});

onMounted(() => {
  if (field.value) {
    field.value.textContent = props.modelValue;
  }
});

function focusField() {
  nextTick(() => field.value?.focus());
}
</script>
