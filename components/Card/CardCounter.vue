<template>
  <CardArchiveCounter :item="item" v-if="item.archived" />
  <CardLiveCounter :item="item" v-else />
</template>

<script lang="ts" setup>
import type { Item } from '~/stores/items';

defineProps<{ item: Item }>()
</script>
