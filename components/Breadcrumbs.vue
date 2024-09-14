<template>
  <div v-if="useItemsStore().currentItem" class="flex items-center space-x-2">
    <div @click="home" class="border border-gray-600 flex items-center justify-center rounded-sm w-6 h-6">
      <Icon name="ph:house"></Icon>
    </div>
    <div @click="up" class="border border-gray-600 flex items-center justify-center rounded-sm w-6 h-6">
      ..
    </div>
    <div>
      / {{ useItemsStore().currentItem?.name }}
    </div>
  </div>
  <div v-else class="flex items-center space-x-2">
    <div class="border border-gray-200 text-gray-400 flex items-center justify-center rounded-sm w-6 h-6">
      <Icon name="ph:house"></Icon>
    </div>
    <div>/</div>
  </div>
</template>

<script lang="ts" setup>
function home() {
  useItemsStore().selectFolder()
}

function up() {
  if (useItemsStore().currentItem) {
    useItemsStore().quitFolder(useItemsStore().currentItem!)
  }
}
</script>

<style></style>