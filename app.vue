<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Переключатель архива -->
    <div class="flex justify-end mb-6">
      <label for="archive-toggle" class="flex items-center cursor-pointer">
        <div class="relative">
          <input type="checkbox" id="archive-toggle" v-model="showArchive" class="sr-only">
          <div class="block bg-gray-300 w-14 h-8 rounded-full"></div>
          <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
            :class="{ 'transform translate-x-6': showArchive }"></div>
        </div>
        <div class="ml-3 text-gray-700 font-medium">
          Архив
        </div>
      </label>
    </div>

    <div v-if="displayedItems.length === 0 && showArchive" class="text-center text-gray-500 py-8">
      В архиве пока нет элементов. Архивируйте таймер или счетчик, чтобы он появился здесь.
    </div>

    <div v-else class="space-y-4">
      <!-- Список таймеров и счетчиков -->
      <div v-for="item in displayedItems" :key="item.id" class="rounded-lg shadow p-4 transition-colors duration-1100"
        :class="{
          'bg-white': !item.archived,
          'bg-gray-300': item.archived,
          'border-2 border-green-500': item.running && !item.archived,
          'deleting-animation': item.deleting
        }" :style="{ backgroundColor: item.deleteProgress ? getDeleteColor(item.deleteProgress) : '' }">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-grow mr-2">
            <p v-if="!item.isEditing || item.archived" @click="startEditing(item)"
              class="text-lg font-semibold px-2 py-1 cursor-pointer hover:bg-gray-100 rounded whitespace-pre-wrap"
              :class="{ 'cursor-default hover:bg-transparent': item.archived }">{{ item.name }}</p>
            <textarea v-else v-model="item.name" @blur="finishEditing(item)"
              @keydown.enter.prevent="finishEditing(item)"
              class="text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full resize-none overflow-hidden"
              :ref="el => { if (el) textareaRefs[item.id] = el }" rows="1"></textarea>
          </div>
          <div class="flex items-start space-x-2">
            <button @click="toggleArchive(item)" class="text-blue-500 hover:text-blue-700 flex-shrink-0">
              <svg v-if="!item.archived" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button v-if="item.archived" @mousedown="startDeleteItem(item)" @mouseup="cancelDeleteItem(item)"
              @mouseleave="cancelDeleteItem(item)" @touchstart.prevent="startDeleteItem(item)"
              @touchend.prevent="cancelDeleteItem(item)" @touchcancel.prevent="cancelDeleteItem(item)"
              class="text-red-500 hover:text-red-700 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <template v-if="item.type === 'timer'">
          <div class="text-3xl font-bold text-center mb-2">
            {{ formatTime(item.elapsedTime) }}
          </div>
          <div v-if="!item.archived" class="flex justify-center space-x-2">
            <button @click="startTimer(item)" class="px-4 py-2 rounded text-white"
              :class="item.running ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'"
              :disabled="item.running">
              {{ item.running ? 'Запущен' : 'Старт' }}
            </button>
            <button @click="stopTimer(item)" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              :disabled="!item.running">Стоп</button>
          </div>
        </template>
        <template v-else>
          <div v-if="!item.archived" class="flex justify-center items-center space-x-4">
            <button @click="decrementCounter(item)"
              class="bg-red-500 text-white w-16 h-16 flex items-center justify-center text-4xl font-bold rounded hover:bg-red-600 transition-colors"
              :disabled="item.count === 0">
              <span class="transform translate-y-[-2px]">-</span>
            </button>

            <div class="text-5xl font-bold text-center w-32 flex items-center justify-center">
              {{ item.count }}
            </div>

            <button @click="incrementCounter(item)"
              class="bg-blue-500 text-white w-16 h-16 flex items-center justify-center text-4xl font-bold rounded hover:bg-blue-600 transition-colors">
              <span class="transform translate-y-[-2px]">+</span>
            </button>
          </div>
          <div v-else class="text-5xl font-bold text-center flex items-center justify-center">
              {{ item.count }}
            </div>
        </template>
      </div>

      <!-- Кнопки добавления нового таймера и счетчика -->
      <div v-if="!showArchive" class="flex space-x-2">
        <button @click="addNewItem('timer')"
          class="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Добавить таймер
        </button>
        <button @click="addNewItem('counter')"
          class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300">
          Добавить счетчик
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const showArchive = ref(false)
const items = ref([])
const textareaRefs = ref({})

const displayedItems = computed(() => {
  const filteredItems = items.value.filter(item => item.archived === showArchive.value)
  if (showArchive.value) {
    return filteredItems.sort((a, b) => b.archivedAt - a.archivedAt)
  } else {
    return filteredItems.sort((a, b) => a.createdAt - b.createdAt)
  }
})

const startEditing = (item) => {
  if (!item.archived) {
    item.isEditing = true
    nextTick(() => {
      const textarea = textareaRefs.value[item.id]
      if (textarea) {
        textarea.focus()
        autoResize(textarea)
      }
    })
  }
}

const getDeleteColor = (progress) => {
  // Начальный цвет bg-gray-300 в RGB: 209, 213, 219
  const startR = 209;
  const startG = 213;
  const startB = 219;

  // Конечный цвет (красный): 255, 0, 0
  const endR = 255;
  const endG = 0;
  const endB = 0;

  const r = Math.round(startR + (endR - startR) * progress);
  const g = Math.round(startG + (endG - startG) * progress);
  const b = Math.round(startB + (endB - startB) * progress);

  return `rgb(${r}, ${g}, ${b})`;
}

const finishEditing = (item) => {
  item.isEditing = false
  item.lastModified = Date.now()
  saveItems()
}

const autoResize = (textarea) => {
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const getNextItemName = (type) => {
  const existingNames = items.value.filter(i => i.type === type).map(i => i.name)
  let index = 1
  let newName = `${type === 'timer' ? 'Таймер' : 'Счетчик'} ${index}`
  while (existingNames.includes(newName)) {
    index++
    newName = `${type === 'timer' ? 'Таймер' : 'Счетчик'} ${index}`
  }
  return newName
}

const addNewItem = (type) => {
  const newId = items.value.length > 0 ? Math.max(...items.value.map(i => i.id)) + 1 : 1
  const now = Date.now()
  const newItem = {
    id: newId,
    type: type,
    name: getNextItemName(type),
    isEditing: false,
    archived: false,
    createdAt: now,
    lastModified: now,
    deleting: false,
    deleteProgress: 0
  }

  if (type === 'timer') {
    newItem.elapsedTime = 0
    newItem.running = false
    newItem.lastStartTime = null
  } else {
    newItem.count = 0
  }

  items.value.push(newItem)
  saveItems()
}

const toggleArchive = (item) => {
  if (!item.archived) {
    if (item.type === 'timer') stopTimer(item)
    item.archivedAt = Date.now()
  } else {
    item.archivedAt = null
  }
  item.archived = !item.archived
  item.lastModified = Date.now()
  saveItems()
}

const startDeleteItem = (item) => {
  item.deleting = true
  item.deleteStartTime = Date.now()
  item.deleteAnimationFrame = requestAnimationFrame(() => updateDeleteProgress(item))
}

const updateDeleteProgress = (item) => {
  const elapsed = Date.now() - item.deleteStartTime
  item.deleteProgress = Math.min(elapsed / 1100, 1)

  if (item.deleteProgress < 1) {
    item.deleteAnimationFrame = requestAnimationFrame(() => updateDeleteProgress(item))
  } else {
    deleteItem(item)
  }
}

const cancelDeleteItem = (item) => {
  if (item.deleting) {
    cancelAnimationFrame(item.deleteAnimationFrame)
    item.deleting = false
    item.deleteProgress = 0
  }
}

const deleteItem = (item) => {
  const index = items.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    items.value.splice(index, 1)
    saveItems()
  }
}

const startTimer = (timer) => {
  if (!timer.running && !timer.archived) {
    timer.running = true
    timer.lastStartTime = Date.now()
    saveItems()
  }
}

const stopTimer = (timer) => {
  if (timer.running) {
    timer.running = false
    timer.elapsedTime += Date.now() - timer.lastStartTime
    timer.lastStartTime = null
    timer.lastModified = Date.now()
    saveItems()
  }
}

const incrementCounter = (counter) => {
  counter.count++
  counter.lastModified = Date.now()
  saveItems()
}

const decrementCounter = (counter) => {
  if (counter.count > 0) {
    counter.count--
    counter.lastModified = Date.now()
    saveItems()
  }
}

const updateRunningTimers = () => {
  const now = Date.now()
  items.value.forEach(item => {
    if (item.type === 'timer' && item.running) {
      item.elapsedTime = item.elapsedTime + (now - item.lastStartTime)
      item.lastStartTime = now
    }
  })
  saveItems()
}

const formatTime = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))
  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .join(":")
}

const saveItems = () => {
  localStorage.setItem('items', JSON.stringify(items.value))
}

const loadItems = () => {
  const savedItems = localStorage.getItem('items')
  const savedTimers = localStorage.getItem('timers')

  if (savedItems) {
    items.value = JSON.parse(savedItems)
    const now = Date.now()
    items.value.forEach(item => {
      if (item.type === 'timer' && item.running) {
        item.elapsedTime += now - item.lastStartTime
        item.lastStartTime = now
      }
      item.deleting = false
      item.deleteProgress = 0
    })
  } else if (savedTimers) {
    // Миграция старых данных
    const oldTimers = JSON.parse(savedTimers)
    items.value = oldTimers.map(timer => ({
      ...timer,
      type: 'timer',
      count: 0, // Добавляем поле count для совместимости с новой структурой
    }))

    // Сохраняем мигрированные данные в новом формате
    saveItems()

    // Удаляем старые данные
    localStorage.removeItem('timers')

    console.log('Миграция данных завершена')
  } else {
    items.value = []
  }
}

let intervalId

onMounted(() => {
  loadItems()
  intervalId = setInterval(updateRunningTimers, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

watch(items, () => {
  saveItems()
}, { deep: true })
</script>

<style scoped>
#archive-toggle:checked~.dot {
  transform: translateX(100%);
}

#archive-toggle:checked~.block {
  background-color: #4A5568;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

textarea {
  min-height: 1.5em;
  line-height: 1.5;
}

.deleting-animation {
  transition: background-color 1.1s linear;
}
</style>