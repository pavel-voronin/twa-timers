<template>
  <div :id="`item-${item.id}-select`" class="rounded-lg shadow py-4 px-2" @click.capture="click">

    <div class="flex justify-between items-start mb-2">
      <div class="flex-grow mr-2">
        <EditableField v-model="item.name" @update:model-value="item.lastModified = Date.now()" />
      </div>

      <div class="flex items-start space-x-2 mt-1">
        <Icon v-if="!selected" name="ic:outline-circle" size="26" class="text-gray-400"
          :class="[!selectMode && 'opacity-0']" />
        <Icon v-else name="ic:outline-check-circle" size="26" class="text-blue-600 " />
      </div>
    </div>

    <slot></slot>

  </div>
</template>

<script lang="ts" setup>
import type { Item } from '~/stores/items';
const props = defineProps<{ item: Item }>()

const actionsStore = useActionsStore()
const selected = computed(() => { return actionsStore.selectedItems.findIndex(item => item === props.item) !== -1 })
const selectMode = storeToRefs(actionsStore).selectMode

const click = (event: Event) => {
  if (actionsStore.selectMode) {
    if (selected.value) {
      actionsStore.removeItem(props.item)
    } else {
      actionsStore.addItem(props.item)
    }

    event.stopPropagation()
  }
}
</script>

<style></style>