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

    <div v-if="displayedTimers.length === 0 && showArchive" class="text-center text-gray-500 py-8">
      В архиве пока нет таймеров. Архивируйте таймер, чтобы он появился здесь.
    </div>

    <div v-else class="space-y-4">
      <!-- Список таймеров -->
      <div v-for="timer in displayedTimers" :key="timer.id"
        class="rounded-lg shadow p-4 transition-colors duration-1100" :class="{
          'bg-white': !timer.archived,
          'bg-gray-300': timer.archived,
          'border-2 border-green-500': timer.running && !timer.archived,
          'deleting-animation': timer.deleting
        }" :style="{ backgroundColor: timer.deleteProgress ? getDeleteColor(timer.deleteProgress) : '' }">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-grow mr-2">
            <p v-if="!timer.isEditing || timer.archived" @click="startEditing(timer)"
              class="text-lg font-semibold px-2 py-1 cursor-pointer hover:bg-gray-100 rounded whitespace-pre-wrap"
              :class="{ 'cursor-default hover:bg-transparent': timer.archived }">{{ timer.name }}</p>
            <textarea v-else v-model="timer.name" @blur="finishEditing(timer)"
              @keydown.enter.prevent="finishEditing(timer)"
              class="text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full resize-none overflow-hidden"
              :ref="el => { if (el) textareaRefs[timer.id] = el }" rows="1"></textarea>
          </div>
          <div class="flex items-start space-x-2">
            <button @click="toggleArchive(timer)" class="text-blue-500 hover:text-blue-700 flex-shrink-0">
              <svg v-if="!timer.archived" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
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
            <button v-if="timer.archived" @mousedown="startDeleteTimer(timer)" @mouseup="cancelDeleteTimer(timer)"
              @mouseleave="cancelDeleteTimer(timer)" @touchstart.prevent="startDeleteTimer(timer)"
              @touchend.prevent="cancelDeleteTimer(timer)" @touchcancel.prevent="cancelDeleteTimer(timer)"
              class="text-red-500 hover:text-red-700 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <div class="text-3xl font-bold text-center mb-2">{{ formatTime(timer.elapsedTime) }}</div>
        <div v-if="!timer.archived" class="flex justify-center space-x-2">
          <button @click="startTimer(timer)" class="px-4 py-2 rounded text-white"
            :class="timer.running ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'"
            :disabled="timer.running">
            {{ timer.running ? 'Запущен' : 'Старт' }}
          </button>
          <button @click="stopTimer(timer)" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            :disabled="!timer.running">Стоп</button>
        </div>
      </div>

      <!-- Кнопка добавления нового таймера -->
      <button v-if="!showArchive" @click="addNewTimer"
        class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
        Добавить новый таймер
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const showArchive = ref(false)
const timers = ref([])
const textareaRefs = ref({})

const displayedTimers = computed(() => {
  const filteredTimers = timers.value.filter(timer => timer.archived === showArchive.value)
  if (showArchive.value) {
    return filteredTimers.sort((a, b) => b.archivedAt - a.archivedAt)
  } else {
    return filteredTimers.sort((a, b) => a.createdAt - b.createdAt)
  }
})

const startEditing = (timer) => {
  if (!timer.archived) {
    timer.isEditing = true
    nextTick(() => {
      const textarea = textareaRefs.value[timer.id]
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
const finishEditing = (timer) => {
  timer.isEditing = false
  timer.lastModified = Date.now()
  saveTimers()
}

const autoResize = (textarea) => {
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}

const getNextTimerName = () => {
  const existingNames = timers.value.map(t => t.name)
  let index = 1
  let newName = `Таймер ${index}`
  while (existingNames.includes(newName)) {
    index++
    newName = `Таймер ${index}`
  }
  return newName
}

const addNewTimer = () => {
  const newId = timers.value.length > 0 ? Math.max(...timers.value.map(t => t.id)) + 1 : 1
  const now = Date.now()
  timers.value.push({
    id: newId,
    name: getNextTimerName(),
    elapsedTime: 1000 * 60 * 60 * 760,
    isEditing: false,
    archived: false,
    createdAt: now,
    lastModified: now,
    running: false,
    lastStartTime: null,
    archivedAt: null,
    deleting: false,
    deleteProgress: 0
  })
  saveTimers()
}

const toggleArchive = (timer) => {
  if (!timer.archived) {
    stopTimer(timer)
    timer.archivedAt = Date.now()
  } else {
    timer.archivedAt = null
  }
  timer.archived = !timer.archived
  timer.lastModified = Date.now()
  saveTimers()
}

const startDeleteTimer = (timer) => {
  timer.deleting = true
  timer.deleteStartTime = Date.now()
  timer.deleteAnimationFrame = requestAnimationFrame(() => updateDeleteProgress(timer))
}

const updateDeleteProgress = (timer) => {
  const elapsed = Date.now() - timer.deleteStartTime
  timer.deleteProgress = Math.min(elapsed / 1100, 1)

  if (timer.deleteProgress < 1) {
    timer.deleteAnimationFrame = requestAnimationFrame(() => updateDeleteProgress(timer))
  } else {
    deleteTimer(timer)
  }
}

const cancelDeleteTimer = (timer) => {
  if (timer.deleting) {
    cancelAnimationFrame(timer.deleteAnimationFrame)
    timer.deleting = false
    timer.deleteProgress = 0
  }
}

const deleteTimer = (timer) => {
  const index = timers.value.findIndex(t => t.id === timer.id)
  if (index !== -1) {
    timers.value.splice(index, 1)
    saveTimers()
  }
}

const startTimer = (timer) => {
  if (!timer.running && !timer.archived) {
    timer.running = true
    timer.lastStartTime = Date.now()
    saveTimers()
  }
}

const stopTimer = (timer) => {
  if (timer.running) {
    timer.running = false
    timer.elapsedTime += Date.now() - timer.lastStartTime
    timer.lastStartTime = null
    timer.lastModified = Date.now()
    saveTimers()
  }
}

const updateRunningTimers = () => {
  const now = Date.now()
  timers.value.forEach(timer => {
    if (timer.running) {
      timer.elapsedTime = timer.elapsedTime + (now - timer.lastStartTime)
      timer.lastStartTime = now
    }
  })
  saveTimers()
}

const formatTime = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))
  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .join(":")
}

const saveTimers = () => {
  localStorage.setItem('timers', JSON.stringify(timers.value))
}

const loadTimers = () => {
  const savedTimers = localStorage.getItem('timers')
  if (savedTimers) {
    timers.value = JSON.parse(savedTimers)
    const now = Date.now()
    timers.value.forEach(timer => {
      if (timer.running) {
        timer.elapsedTime += now - timer.lastStartTime
        timer.lastStartTime = now
      }
      timer.deleting = false
      timer.deleteProgress = 0
    })
  }
}

let intervalId

onMounted(() => {
  loadTimers()
  intervalId = setInterval(updateRunningTimers, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId)
})

watch(timers, () => {
  saveTimers()
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