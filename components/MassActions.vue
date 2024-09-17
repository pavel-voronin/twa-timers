<template>
  <transition enter-active-class="transition-transform duration-200" enter-from-class="translate-y-full"
    enter-to-class="translate-y-0" leave-active-class="transition-transform duration-200"
    leave-from-class="translate-y-0" leave-to-class="translate-y-full">
    <div v-if="selectMode"
      class="fixed bottom-0 w-full h-24 bg-gradient-to-r from-gray-200 to-green-400 p-4 flex space-x-2 items-center select-none text-lg z-50">
      <div @click="remove" class="rounded-lg bg-red-500 text-white flex items-center px-2 py-1.5 cursor-pointer"
        :class="[selectedItems.length === 0 && 'opacity-50 grayscale cursor-default']">Удалить</div>
      <div @click="moveOut" class="rounded-lg bg-indigo-500 text-white flex items-center px-2 py-1.5 cursor-pointer"
        :class="[!canMoveOut && 'opacity-50 grayscale cursor-default']">В род. папку</div>
      <div class="flex-grow"></div>
      <div @click="selectMode = false" class="rounded-lg bg-green-100 flex items-center px-2 py-1.5 cursor-pointer">
        Отмена
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const itemsStore = useItemsStore()
const actionsStore = useActionsStore()

const selectMode = storeToRefs(actionsStore).selectMode
const selectedItems = storeToRefs(actionsStore).selectedItems

function remove() {
  if (selectedItems.value.length) {
    for (const item of selectedItems.value) {
      itemsStore.deleteItem(item)
      selectMode.value = false
    }
  }
}

const canMoveOut = computed(() => itemsStore.currentItemId !== null && selectedItems.value.length > 0)

function moveOut() {
  if (canMoveOut.value) {
    itemsStore.moveItems(selectedItems.value, itemsStore.parent(itemsStore.currentItem!))
    selectMode.value = false
    actionsStore.clear()
  }
}
</script>
