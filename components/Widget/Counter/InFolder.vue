<template>
  <DesignTitledLayoutCard>

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

    <div class="flex justify-center items-center space-x-4">
      <button @click="decrement"
        class="bg-red-500 text-white w-16 h-16 flex items-center justify-center text-4xl font-bold rounded"
        :class="[item.count === item.from && !Number.isFinite(item.to) && 'opacity-50 cursor-default' || 'hover:bg-red-600 cursor-pointer']">
        <Icon name="ic:baseline-remove" />
      </button>

      <div class="text-5xl font-bold text-center w-32 flex items-center justify-center cursor-default">
        {{ item.count }}
      </div>

      <button @click="increment"
        class="bg-blue-500 text-white w-16 h-16 flex items-center justify-center text-4xl font-bold rounded"
        :class="[item.count === item.to && !Number.isFinite(item.from) && 'opacity-50 cursor-default' || 'hover:bg-blue-600 cursor-pointer']">
        <Icon name="ic:baseline-add" />
      </button>
    </div>

  </DesignTitledLayoutCard>
</template>

<script lang="ts" setup>
import type { Counter } from './definition';

const props = defineProps<{ item: Counter }>()

function getValidStep(step: any): number {
  return typeof step === 'number' && step >= 1 ? step : 1;
}

function getValidMinMax(min: any): number | null {
  return typeof min === 'number' ? min : null;
}

function decrement() {
  const step = getValidStep(props.item.step);
  const min = getValidMinMax(props.item.from);
  const max = getValidMinMax(props.item.to);
  const count = props.item.count;

  if (min !== null && max !== null) {
    if (count - step < min) {
      props.item.count = max - ((min - (count - step) - 1) % (max - min));
      return
    }
  } else if (min !== null) {
    if (count - step < min) {
      props.item.count = min;
      return
    }
  }

  props.item.count = count - step;
}

function increment() {
  const step = getValidStep(props.item.step);
  const min = getValidMinMax(props.item.from);
  const max = getValidMinMax(props.item.to);
  const count = props.item.count;

  if (min !== null && max !== null) {
    if (count + step > max) {
      props.item.count = min + ((count + step - max - 1) % (max - min));
      return;
    }
  } else if (max !== null) {
    if (count + step > max) {
      props.item.count = max;
      return
    }
  }

  props.item.count = count + step;
}
</script>
