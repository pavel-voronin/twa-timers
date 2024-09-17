<template>
  <DesignTitledLayoutCard :class="{
    'outline outline-2 outline-green-500': item.running,
  }">

    <template #top-left>
      <p class="text-lg font-semibold line-clamp-2 cursor-default">
        {{ item.name }}
      </p>
    </template>

    <template #top-right>
      <Sortable :item="item" />
      <Selectable :item="item" />
    </template>

    <div class="text-3xl font-bold text-center mb-2">
      {{ formatTime(item.elapsedTime) }}
    </div>

    <div class="flex justify-center space-x-2">

      <button @click="startTimer" class="px-4 py-2 rounded text-white"
        :class="item.running ? 'bg-gray-500 cursor-default opacity-50' : 'bg-green-500 hover:bg-green-600'">
        {{ item.running ? 'Запущен' : 'Старт' }}
      </button>

      <button @click="stopTimer" class="bg-yellow-500 text-white px-4 py-2 rounded"
        :class="item.running ? 'hover:bg-yellow-600' : 'opacity-50 cursor-default'">Стоп</button>

    </div>

  </DesignTitledLayoutCard>
</template>

<script lang="ts">
type Timer = Item<"timer"> & {
  elapsedTime: number;
} & (
    | {
      running: true;
      lastStartTime: number;
    }
    | {
      running: false;
      lastStartTime: null;
    }
  );

const timers = computed<Timer[]>(() => useItemsStore().items.filter(({ type }) => type === 'timer') as Timer[])

setInterval(() => {
  const now = Date.now();

  timers.value.forEach((timer: Timer) => {

    if (timer.running) {
      timer.elapsedTime += now - timer.lastStartTime;
      timer.lastStartTime = now;
    }
  })
}, 1000);

export const config: WidgetConfig = {
  name: "timer",
  label: "Таймер",
  canContain: false,
  add() {
    useItemsStore().addNewItem<Timer>({
      type: "timer",
      name: "Таймер",
      running: false,
      lastStartTime: null,
      elapsedTime: 0,
    });
  },
};
</script>

<script lang="ts" setup>
const props = defineProps<{ item: Timer }>();

const formatTime = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))
  return [hours, minutes, seconds]
    .map(v => v < 10 ? "0" + v : v)
    .join(":")
}

const startTimer = () => {
  if (!props.item.running) {
    (props.item as unknown as any).running = true;
    (props.item as unknown as any).lastStartTime = Date.now();
  }
};

const stopTimer = () => {
  if (props.item.running) {
    (props.item as unknown as any).running = false;
    props.item.elapsedTime += Date.now() - props.item.lastStartTime;
    (props.item as unknown as any).lastStartTime = null;
  }
};
</script>
