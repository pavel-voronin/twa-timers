<template>
  <DesignTitledLayoutCard :class="{
    'outline outline-2 outline-green-500': item.running,
  }">

    <template #top-left>
      <p class="text-lg font-semibold line-clamp-2 cursor-default">
        {{ item.name }}
      </p>
    </template>

    <template #top-right>
      <Sortable :item="item" />
      <Selectable :item="item" />
      <Configurable :item="item" />
    </template>

    <div class="text-3xl font-bold text-center mb-2">
      {{ formatTime(item.elapsedTime) }}
    </div>

    <div class="flex justify-center space-x-2">

      <button @click="startTimer" class="px-4 py-2 rounded text-white"
        :class="item.running ? 'bg-gray-500 cursor-default opacity-50' : 'bg-green-500 hover:bg-green-600'">
        {{ item.running ? 'Запущен' : 'Старт' }}
      </button>

      <button @click="stopTimer" class="bg-yellow-500 text-white px-4 py-2 rounded"
        :class="item.running ? 'hover:bg-yellow-600' : 'opacity-50 cursor-default'">Стоп</button>

    </div>

  </DesignTitledLayoutCard>
</template>

<script lang="ts" setup>
import type { Timer } from './definition';

const props = defineProps<{ item: Timer }>();

const formatTime = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))
  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .join(":")
}

const startTimer = () => {
  if (!props.item.running) {
    (props.item as unknown as any).running = true;
    (props.item as unknown as any).lastStartTime = Date.now();
  }
};

const stopTimer = () => {
  if (props.item.running) {
    (props.item as unknown as any).running = false;
    props.item.elapsedTime += Date.now() - props.item.lastStartTime;
    (props.item as unknown as any).lastStartTime = null;
  }
};
</script>
