<script lang="ts">
import type { WidgetConfig } from '~/stores/items';

export type Counter = Item<"counter"> & {
  count: number;
};

export const config: WidgetConfig = {
  name: 'counter',
  label: 'Счётчик',
  canContain: false,
  add() {
    useItemsStore().addNewItem<Counter>({ type: 'counter', name: 'Счётчик', count: 0 })
  },
}
</script>
