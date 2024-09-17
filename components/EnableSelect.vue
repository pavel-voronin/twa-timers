<template>
  <div v-if="active" @click="selectMode = !selectMode" class="text-blue-500 cursor-pointer select-none">
    <template v-if="selectMode">Отмена</template>
    <template v-else>Выбрать</template>
  </div>
  <div v-else class="text-gray-400 cursor-default">Выбрать</div>
</template>

<script lang="ts" setup>
defineProps<{ active: boolean }>()
defineEmits<{ 'update:modelValue': [boolean] }>()

const selectMode = storeToRefs(useActionsStore()).selectMode
</script>

<style></style>