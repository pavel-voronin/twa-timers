<template>
  <Card :item="item" v-if="item.type == 'counter'">
    <div class="flex justify-center items-center space-x-4">
      <button @click="useItemsStore().decrementCounter(item)"
        class="bg-red-500 text-white w-16 h-16 flex items-center justify-center text-4xl font-bold rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="item.count === 0">
        <span class="transform translate-y-[-2px]">-</span>
      </button>

      <div class="text-5xl font-bold text-center w-32 flex items-center justify-center">
        {{ item.count }}
      </div>

      <button @click="useItemsStore().incrementCounter(item)"
        class="bg-blue-500 text-white w-16 h-16 flex items-center justify-center text-4xl font-bold rounded hover:bg-blue-600 transition-colors">
        <span class="transform translate-y-[-2px]">+</span>
      </button>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import type { Item } from '~/stores/items';

defineProps<{ item: Item }>()
</script>
