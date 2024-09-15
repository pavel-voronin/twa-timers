<template>
  <DesignTitledLayoutCard>

    <template #top-left>
      <p class="text-lg font-semibold line-clamp-2 cursor-default">
        {{ item.name }}
      </p>
    </template>

    <template #top-right>
      <Selectable :item="item" />
    </template>

    <div class="flex justify-center items-center space-x-4">
      <button @click="decrement"
        class="bg-red-500 text-white w-16 h-16 flex items-center justify-center text-4xl font-bold rounded"
        :class="[item.count === 0 && 'opacity-50 cursor-default' || 'hover:bg-red-600 cursor-pointer']">
        <Icon name="ic:baseline-remove" />
      </button>

      <div class="text-5xl font-bold text-center w-32 flex items-center justify-center cursor-default">
        {{ item.count }}
      </div>

      <button @click="increment"
        class="bg-blue-500 text-white w-16 h-16 flex items-center justify-center text-4xl font-bold rounded hover:bg-blue-600">
        <Icon name="ic:baseline-add" />
      </button>
    </div>

  </DesignTitledLayoutCard>
</template>

<script lang="ts">
import type { WidgetConfig } from '~/stores/items';

type Counter = Item<"counter"> & {
  count: number;
};

export const config: WidgetConfig = {
  name: 'counter',
  label: 'Счётчик',
  add() {
    useItemsStore().addNewItem<Counter>({ type: 'counter', name: 'Счётчик', count: 0 })
  },
}
</script>

<script lang="ts" setup>

const props = defineProps<{ item: Counter }>()

const decrement = () => {
  props.item.count = Math.max(0, props.item.count - 1)
}
const increment = () => {
  props.item.count += 1
}
</script>
