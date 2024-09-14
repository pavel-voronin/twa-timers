<template>
  <DeletableCard :item="item" v-if="item.type == 'folder'">

  </DeletableCard>
</template>

<script lang="ts" setup>
import type { Item } from '~/stores/items';

defineProps<{ item: Item }>()
</script>
