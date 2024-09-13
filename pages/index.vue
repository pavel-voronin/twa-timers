<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Переключатель архива -->
    <ArchiveToggle v-model="showArchive" />

    <div v-if="displayedItems.length === 0 && showArchive" class="text-center text-gray-500 py-8">
      В архиве пока нет элементов. Архивируйте таймер или счетчик, чтобы он появился здесь.
    </div>

    <div v-else class="space-y-4">
      <!-- Список таймеров и счетчиков -->
      <Item v-for="item in displayedItems" :key="item.id" :item="item" />

      <!-- Кнопки добавления нового таймера и счетчика -->
      <div v-if="!showArchive" class="flex space-x-2">
        <button @click="useItemsStore().addNewTimer"
          class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Добавить таймер
        </button>
        <button @click="useItemsStore().addNewCounter"
          class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300">
          Добавить счетчик
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const showArchive = ref(false)
const items = storeToRefs(useItemsStore()).items

const displayedItems = computed(() => {
  if (showArchive.value) {
    return items.value.filter(item => item.archived).sort((a, b) => b.archivedAt - a.archivedAt)
  } else {
    return items.value.filter(item => !item.archived).sort((a, b) => a.createdAt - b.createdAt)
  }
})
</script>
