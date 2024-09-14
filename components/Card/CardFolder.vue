<template>
  <Card :item="item" v-if="item.type == 'folder'">
    <div v-if="useItemsStore().currentItem !== item" @click="useItemsStore().selectFolder(item)"
      class="text-center text-blue-600 underline">
      перейти &rarr;
    </div>
    <div v-else @click="useItemsStore().quitFolder(item)" class="text-center text-blue-600 underline">
      &larr; выйти
    </div>
  </Card>
</template>

<script lang="ts" setup>
import type { Item } from '~/stores/items';

defineProps<{ item: Item }>()
</script>
