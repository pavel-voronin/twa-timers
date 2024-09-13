<template>
  <Card :item="item" :class="[item.archived && 'transition-colors duration-1100']"
    :style="{ backgroundColor: item.archived && deleteProgress ? getDeleteColor(deleteProgress) : '' }">

    <template #title>
      <slot name="title"></slot>
    </template>

    <template #buttons>
      <slot name="buttons"></slot>

      <button v-if="item.archived" @mousedown="startDeleteItem" @mouseup="cancelDeleteItem"
        @mouseleave="cancelDeleteItem" @touchstart.prevent="startDeleteItem" @touchend.prevent="cancelDeleteItem"
        @touchcancel.prevent="cancelDeleteItem" class="text-red-500 hover:text-red-700 flex-shrink-0">
        <IconDelete />
      </button>
    </template>

    <slot></slot>
  </Card>
</template>

<script lang="ts" setup>
import type { Item } from '~/stores/items';

const props = defineProps<{ item: Item }>()

let deleting = ref(false)
let deleteStartTime = ref(0)
let deleteAnimationFrame = ref(0)
let deleteProgress = ref(0)

const getDeleteColor = (progress: number) => {
  // Начальный цвет bg-gray-300 в RGB: 209, 213, 219
  const startR = 209;
  const startG = 213;
  const startB = 219;

  // Конечный цвет (красный): 255, 0, 0
  const endR = 255;
  const endG = 0;
  const endB = 0;

  const r = Math.round(startR + (endR - startR) * progress);
  const g = Math.round(startG + (endG - startG) * progress);
  const b = Math.round(startB + (endB - startB) * progress);

  return `rgb(${r}, ${g}, ${b})`;
}

const startDeleteItem = () => {
  deleting.value = true
  deleteStartTime.value = Date.now()
  deleteAnimationFrame.value = requestAnimationFrame(() => updateDeleteProgress())
}

const updateDeleteProgress = () => {
  const elapsed = Date.now() - deleteStartTime.value
  deleteProgress.value = Math.min(elapsed / 1100, 1)

  if (deleteProgress.value < 1) {
    deleteAnimationFrame.value = requestAnimationFrame(() => updateDeleteProgress())
  } else {
    useItemsStore().deleteItem(props.item)
  }
}

const cancelDeleteItem = () => {
  if (deleting.value) {
    cancelAnimationFrame(deleteAnimationFrame.value)
    deleting.value = false
    deleteProgress.value = 0
  }
}
</script>
