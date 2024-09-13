<template>
  <CardCounter v-if="item.type == 'counter'" :item="item" />
  <CardTimer v-else-if="item.type == 'timer'" :item="item" />
</template>

<script lang="ts" setup>
import type { Item } from '~/stores/items';

defineProps<{ item: Item }>()
</script>