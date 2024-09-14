<template>
  <Card :item="item" v-if="item.type === 'timer'" :class="{
    'outline outline-2 outline-green-500': item.type == 'timer' && item.running && !item.archived,
  }">

    <div class="text-3xl font-bold text-center mb-2">
      {{ formatTime(item.elapsedTime) }}
    </div>

    <div v-if="!item.archived" class="flex justify-center space-x-2">
      <button @click="useItemsStore().startTimer(item)"
        class="px-4 py-2 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
        :class="item.running ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'"
        :disabled="item.running">
        {{ item.running ? 'Запущен' : 'Старт' }}
      </button>
      <button @click="useItemsStore().stopTimer(item)"
        class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!item.running">Стоп</button>
    </div>

  </Card>
</template>

<script lang="ts" setup>
import type { Item } from '~/stores/items';

defineProps<{ item: Item }>()

const formatTime = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))
  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .join(":")
}
</script>
