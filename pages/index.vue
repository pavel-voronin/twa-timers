<template>
  <div class="px-4 py-8 space-y-4">
    <div class="flex justify-between items-center">
      <Breadcrumbs />
      <MultipleChoice :active="displayedItems.length > 0" />
    </div>

    <div class="space-y-4">
      <div v-if="displayedItems.length === 0">
        <EmptyCard>
          В папке ещё нет никаких элементов. Добавьте таймер или счётчик, чтобы они появились здесь.
        </EmptyCard>
      </div>

      <!-- Список таймеров и счетчиков -->
      <Item v-else v-for="item in displayedItems" :key="item.id" :item="item" />

      <!-- Кнопки добавления нового таймера и счетчика -->
      <div class="flex space-x-2">
        <button @click="useItemsStore().addNewTimer"
          class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Добавить таймер
        </button>
        <button @click="useItemsStore().addNewCounter"
          class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300">
          Добавить счетчик
        </button>
        <button @click="useItemsStore().addNewFolder"
          class="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300">
          Добавить папку
        </button>
      </div>
    </div>
  </div>

  <MassActions :items="massActionItems" />
</template>

<script setup lang="ts">
const items = storeToRefs(useItemsStore()).items
const massActionItems = ref<Item[]>([])

const displayedItems = computed(() => {
  return items.value.sort((a, b) => a.createdAt - b.createdAt)
})

</script>
