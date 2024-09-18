<template>
  <div v-if="active" @click="sortMode = !sortMode" class="text-blue-500 cursor-pointer select-none">
    <template v-if="sortMode">Не сортировать</template>
    <template v-else>Сортировать</template>
  </div>
  <div v-else class="text-gray-400 cursor-default">Сортировать</div>
</template>

<script lang="ts" setup>
defineProps<{ active: boolean }>()
defineEmits<{ 'update:modelValue': [boolean] }>()

const sortMode = storeToRefs(useActionsStore()).sortMode
</script>

<style></style>