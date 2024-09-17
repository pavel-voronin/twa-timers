<template>

  <div v-if="item" class="flex items-center space-x-2 select-none">

    <div @click="home"
      class="border border-gray-600 flex items-center justify-center rounded-sm w-6 h-6 cursor-pointer">
      <Icon name="ph:house"></Icon>
    </div>

    <div @click="up" class="border border-gray-600 flex items-center justify-center rounded-sm w-6 h-6 cursor-pointer">
      ..
    </div>

    <div class="cursor-default">
      / {{ item?.name }}
    </div>

  </div>

  <div v-else class="flex items-center space-x-2 select-none">

    <div class="border border-gray-200 text-gray-400 flex items-center justify-center rounded-sm w-6 h-6">
      <Icon name="ph:house"></Icon>
    </div>

    <div class="cursor-default">/</div>

  </div>

</template>

<script lang="ts" setup>
const item = storeToRefs(useItemsStore()).currentItem
const itemId = storeToRefs(useItemsStore()).currentItemId

function home() {
  itemId.value = null
}

function up() {
  if (item.value) {
    itemId.value = item.value && item.value.parentId ? item.value.parentId : null
  }
}
</script>
