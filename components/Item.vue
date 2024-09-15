<template>
  <CardCounter v-if="item.type == 'counter'" :item="item" />
  <CardTimer v-else-if="item.type == 'timer'" :item="item" />
  <CardFolder v-else-if="item.type == 'folder'" :item="item" />
</template>

<script lang="ts" setup>
defineProps<{ item: Item }>()
</script>