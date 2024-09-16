<template>
  <div class="px-4 py-8 space-y-4">
    <div class="flex justify-between items-center">
      <Breadcrumbs />
      <MultipleChoice :active="items.length > 0" />
    </div>

    <div class="space-y-4">
      <div v-if="items.length === 0">
        <DesignEmptyCard>
          В папке ещё нет никаких элементов. Добавьте таймер или счётчик, чтобы они появились здесь.
        </DesignEmptyCard>
      </div>

      <LayoutColumn v-else/>

      <!-- Кнопки добавления нового таймера и счетчика -->
      <div class="flex space-x-2">
        <button v-for="(widget, key, i) in widgets" :key="key"
          @click="!useActionsStore().selectMode ? widget.config.add() : null" class="flex-1 text-white py-2 rounded-lg"
          :class="[useActionsStore().selectMode && 'bg-red-500 opacity-50 grayscale cursor-default' || colors[i % colors.length]]">
          Добавить {{ widget.config.label.toLowerCase() }}
        </button>
      </div>
    </div>
  </div>

  <MassActions />
</template>

<script setup lang="ts">
const widgets = storeToRefs(useItemsStore()).widgets
const items = storeToRefs(useItemsStore()).items

const colors = ['bg-blue-500 hover:bg-blue-600', 'bg-orange-500 hover:bg-orange-600', 'bg-green-500 hover:bg-green-600']
</script>
