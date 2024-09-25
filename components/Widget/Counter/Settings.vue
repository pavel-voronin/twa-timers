<template>
  <div>
    <div class="px-4 py-8 space-y-4">

      <div class="flex justify-start items-center space-x-4 select-none">
        <div class="underline text-blue-600 cursor-pointer" @click="$items.go($items.parent(item))">&larr; назад</div>
        <div class="flex-grow"></div>
        <h1 class="text-lg font-semibold">Настройка счётчика</h1>
      </div>

      <DesignCard class="space-y-4">
        <FormTextareaField v-model="item.name" label="Название" />
        <FormNumberField v-model="item.step" label="Шаг" min="1" />
        <FormNumberField v-model="item.from" label="От" :max="item.to" />
        <FormNumberField v-model="item.to" label="До" :min="item.from" />
      </DesignCard>
    </div>

  </div>
</template>

<script lang="ts" setup>
import type { Counter } from './definition';

const props = defineProps<{ item: Counter }>()
</script>
