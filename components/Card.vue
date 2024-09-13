<template>
  <div class="rounded-lg shadow p-4" :class="{
    'bg-white': !item.archived,
    'bg-gray-300': item.archived,
  }">

    <div class="flex justify-between items-start mb-2">
      <div class="flex-grow mr-2">
        <slot name="title">
          <EditableField v-model="item.name" @update:model-value="item.lastModified = Date.now()"
            :locked="item.archived" />
        </slot>
      </div>

      <div class="flex items-start space-x-2">
        <button @click="useItemsStore().toggleArchive(item)" class="text-blue-500 hover:text-blue-700 flex-shrink-0">
          <IconArchive v-if="!item.archived" />
          <IconRestore v-else />
        </button>

        <slot name="buttons"></slot>
      </div>
    </div>

    <slot></slot>

  </div>
</template>

<script lang="ts" setup>
import type { Item } from '~/stores/items';

defineProps<{ item: Item }>()
</script>

<style></style>