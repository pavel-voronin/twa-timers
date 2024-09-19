export type Timer = Item<"timer"> & {
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

const timers = computed<Timer[]>(
  () => useItemsStore().items.filter(({ type }) => type === "timer") as Timer[]
);

setInterval(() => {
  const now = Date.now();

  timers.value.forEach((timer: Timer) => {
    if (timer.running) {
      timer.elapsedTime += now - timer.lastStartTime;
      timer.lastStartTime = now;
    }
  });
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
