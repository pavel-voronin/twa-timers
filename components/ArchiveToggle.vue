<template>
  <div class="flex justify-end mb-6">
    <label for="archive-toggle" class="flex items-center cursor-pointer">
      <div class="relative">
        <input type="checkbox" id="archive-toggle" :checked="modelValue" class="sr-only" @change="handleChange" />
        <div class="block bg-gray-300 w-14 h-8 rounded-full"></div>
        <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
          :class="{ 'transform translate-x-6': modelValue }"></div>
      </div>
      <div class="ml-3 text-gray-700 font-medium">Архив</div>
    </label>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; }>();
const emit = defineEmits<{ "update:modelValue": [boolean] }>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.checked);
};
</script>

<style scoped>
#archive-toggle:checked~.dot {
  transform: translateX(100%);
}

#archive-toggle:checked~.block {
  background-color: #4A5568;
}
</style>