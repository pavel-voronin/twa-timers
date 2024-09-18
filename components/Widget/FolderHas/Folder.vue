<template>
  <DesignTitledLayoutCard>
    <template #top-left>
      <p class="text-lg font-semibold line-clamp-2 cursor-default">
        {{ item.name }}
      </p>
    </template>

    <template #top-right>
      <Sortable :item="item" />
      <Selectable :item="item" />
    </template>

    <div @click="$items.go(item)" class="text-center text-blue-600 underline cursor-pointer">
      перейти &rarr;
    </div>
  </DesignTitledLayoutCard>
</template>

<script lang="ts" setup>
import type { Folder } from '../Folder.vue';

defineProps<{ item: Folder }>();
</script>
