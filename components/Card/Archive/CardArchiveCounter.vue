<template>
  <DeletableCard :item="item" v-if="item.type == 'counter'">
    <div  class="text-5xl font-bold text-center flex items-center justify-center">
      {{ item.count }}
    </div>
  </DeletableCard>
</template>

<script lang="ts" setup>
import type { Item } from '~/stores/items';

defineProps<{ item: Item }>()
</script>
