<template>
  <component v-for="item in items" :is="widgets[item.type].widget" :key="item.id" :item="item"
    class="flex flex-col space-y-4" />
</template>

<script lang="ts" setup>
const itemsStore = useItemsStore()

const widgets = storeToRefs(itemsStore).widgets
const items = storeToRefs(itemsStore).items
</script>
