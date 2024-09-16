<template>
  <Sortable :list="sorted" item-key="id" :options="options" class="space-y-4 m-4" @end="end">
    <template #item="{ element, index }">
      <DesignEmptyCard @click="element.counter++" class="select-none">
        {{ element.name }}: {{ element.counter }}
      </DesignEmptyCard>
    </template>
  </Sortable>

  <pre>{{ sorted }}</pre>
</template>

<script lang="ts" setup>
import type { SortableEvent, SortableOptions } from "sortablejs";

const elements = ref<
  { id: number; name: string; counter: number; order: number }[]
>([
  { id: 8, name: "One", counter: 0, order: 0 },
  { id: 9, name: "Two", counter: 0, order: 1 },
  { id: 10, name: "Three", counter: 0, order: 2 },
]);
const sorted = computed(() => elements.value.sort((a, b) => a.order - b.order));
const options: SortableOptions = {
  animation: 150,
  direction: "vertical",
  forceFallback: true,
  fallbackTolerance: 20,
  ghostClass: 'opacity-0',
};

const end = ({ newIndex, oldIndex }: SortableEvent) => {
  if (oldIndex === undefined || newIndex === undefined) return;

  elements.value[oldIndex].order =
    elements.value[newIndex].order + 0.005 * (newIndex - oldIndex);
  elements.value = sorted.value.map((v, i) => ({ ...v, order: i }));
};
</script>

<style scoped></style>
