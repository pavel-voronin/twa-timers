<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Переключатель архива -->
    <div class="flex justify-end mb-6">
      <label for="archive-toggle" class="flex items-center cursor-pointer">
        <div class="relative">
          <input type="checkbox" id="archive-toggle" v-model="showArchive" class="sr-only">
          <div class="block bg-gray-600 w-14 h-8 rounded-full"></div>
          <div class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"
            :class="{ 'transform translate-x-6': showArchive }"></div>
        </div>
        <div class="ml-3 text-gray-700 font-medium">
          Архив
        </div>
      </label>
    </div>

    <div class="space-y-4">
      <!-- Список таймеров -->
      <div v-for="timer in timers" :key="timer.id" class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-start mb-2">
          <div class="flex-grow mr-2">
            <p v-if="!timer.isEditing" @click="startEditing(timer)"
              class="text-lg font-semibold px-2 py-1 cursor-pointer hover:bg-gray-100 rounded">{{ timer.name }}</p>
            <input v-else v-model="timer.name" @blur="finishEditing(timer)" @keyup.enter="finishEditing(timer)"
              class="text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-full"
              ref="editInput">
          </div>
          <button class="text-blue-500 hover:text-blue-700 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </button>
        </div>
        <div class="text-3xl font-bold text-center mb-2">{{ timer.time }}</div>
        <div class="flex justify-center space-x-2">
          <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Старт</button>
          <button class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Стоп</button>
        </div>
      </div>

      <!-- Кнопка добавления нового таймера -->
      <button @click="addNewTimer"
        class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
        Добавить новый таймер
      </button>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const showArchive = ref(false)
    const timers = reactive([
      { id: 1, name: 'Таймер с очень длинным названием, которое теперь корректно переносится', time: '00:00:00', isEditing: false },
      { id: 2, name: 'Еще один таймер', time: '00:00:00', isEditing: false },
    ])

    const startEditing = (timer) => {
      timer.isEditing = true
      // Используем nextTick для установки фокуса после рендеринга input
      nextTick(() => {
        const input = document.querySelector(`input[data-id="${timer.id}"]`)
        if (input) input.focus()
      })
    }

    const finishEditing = (timer) => {
      timer.isEditing = false
    }

    const addNewTimer = () => {
      const newId = Math.max(...timers.map(t => t.id)) + 1
      timers.push({ id: newId, name: 'Новый таймер', time: '00:00:00', isEditing: false })
    }

    return {
      showArchive,
      timers,
      startEditing,
      finishEditing,
      addNewTimer
    }
  }
}
</script>

<style scoped>
#archive-toggle:checked~.dot {
  transform: translateX(100%);
}

#archive-toggle:checked~.block {
  background-color: #48bb78;
}
</style>
