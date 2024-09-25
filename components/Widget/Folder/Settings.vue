<template>
  <div>
    <div class="px-4 py-8 space-y-4">

      <div class="flex justify-start items-center space-x-4 select-none">
        <div class="underline text-blue-600 cursor-pointer" @click="$items.go($items.parent(item))">&larr; назад</div>
        <div class="flex-grow"></div>
        <h1 class="text-lg font-semibold">Настройка папки</h1>
      </div>

      <DesignCard class="space-y-4">
        <FormField v-model="item.name" label="Название" />
      </DesignCard>

    </div>

  </div>
</template>

<script lang="ts" setup>
defineProps<{ item: Item }>()
</script>
