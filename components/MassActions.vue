<template>
  <transition enter-active-class="transition-transform duration-200" enter-from-class="translate-y-full"
    enter-to-class="translate-y-0" leave-active-class="transition-transform duration-200"
    leave-from-class="translate-y-0" leave-to-class="translate-y-full">
    <div v-if="selectMode"
      class="fixed bottom-0 w-full h-16 bg-gradient-to-r from-gray-200 to-green-400 p-4 flex space-x-2 items-center">
      <div @click="remove" class="rounded-lg bg-red-500 text-white flex items-center px-2 py-1.5 text-sm cursor-pointer"
        :class="[selectedItems.length === 0 && 'opacity-50 grayscale cursor-default']">Удалить</div>
      <div class="cursor-default">— без следа</div>
      <div class="flex-grow"></div>
      <div @click="selectMode = false" class="rounded-lg bg-green-100 flex items-center px-2 py-1.5 text-sm cursor-pointer">Отмена
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const selectMode = storeToRefs(useActionsStore()).selectMode
const selectedItems = storeToRefs(useActionsStore()).selectedItems

function remove() {
  if (selectedItems.value.length) {
    for (const item of selectedItems.value) {
      useItemsStore().deleteItem(item)
      selectMode.value = false
    }
  }
}
</script>
