<template>
  <DeletableCard :item="item" v-if="item.type === 'timer'" :class="{
    'border-2 border-green-500': item.type == 'timer' && item.running && !item.archived,
  }">
    <div class="text-3xl font-bold text-center mb-2">
      {{ formatTime(item.elapsedTime) }}
    </div>
  </DeletableCard>
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
