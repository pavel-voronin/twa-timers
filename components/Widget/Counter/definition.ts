export type Counter = Item<"counter"> & {
  count: number;
  step: number;
  from: number | null;
  to: number | null;
};

export const config: WidgetConfig = {
  name: "counter",
  label: "Счётчик",
  canContain: false,
  add() {
    useItemsStore().addNewItem<Counter>({
      type: "counter",
      name: "Счётчик",
      count: 0,
      step: 1,
      from: 0,
      to: null,
    });
  },
};
