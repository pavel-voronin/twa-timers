<template>
  <div class="px-4 py-8 space-y-4">
    <div class="flex justify-end items-center">
      <ArchiveToggle v-model="showArchive" />
    </div>

    <div v-if="displayedItems.length === 0 && showArchive">
      <EmptyCard>
        В архиве пока нет элементов. Архивируйте таймер или счетчик, чтобы он появился здесь.
      </EmptyCard>
    </div>

    <div v-else class="space-y-4">
      <div v-if="displayedItems.length === 0 && !showArchive">
        <EmptyCard>
          В проекте ещё нет никаких элементов. Добавьте таймер или счётчик, чтобы они появились здесь.
        </EmptyCard>
      </div>

      <!-- Список таймеров и счетчиков -->
      <Item v-else v-for="item in displayedItems" :key="item.id" :item="item" />

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
