<template>
  <Sortable :list="items" item-key="id" :options="options" class="flex flex-col space-y-4"
    @end="move($event.oldIndex, $event.newIndex)">
    <template #item="{ element }">
      <component :is="widgets[element.type].widget" :key="element.id" :item="element" />
    </template>
  </Sortable>
</template>

<script lang="ts" setup>
import type { SortableOptions } from 'sortablejs';

const itemsStore = useItemsStore()

const widgets = storeToRefs(itemsStore).widgets
const items = storeToRefs(itemsStore).items
const move = itemsStore.moveItem

const options = computed<SortableOptions>(() => ({
  animation: 150,
  direction: "vertical",
  forceFallback: true,
  fallbackTolerance: 20,
  ghostClass: 'ghost',
  disabled: useActionsStore().selectMode
}));
</script>

<style scoped>
.ghost {
  @apply opacity-0 select-none
}
</style>