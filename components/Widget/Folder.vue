<template>
  <DesignTitledLayoutCard>
    <template #top-left>
      <p class="text-lg font-semibold line-clamp-2 cursor-default">
        {{ item.name }}
      </p>
    </template>

    <template #top-right>
      <Sortable :item="item" />
      <Selectable :item="item" />
    </template>

    <div @click="selectFolder" class="text-center text-blue-600 underline cursor-pointer">
      перейти &rarr;
    </div>
  </DesignTitledLayoutCard>
</template>

<script lang="ts">
type Folder = Item<"folder">

export const config: WidgetConfig = {
  name: "folder",
  label: "папку",
  canContain: true,
  add() {
    useItemsStore().addNewItem<Folder>({
      type: "folder",
      name: "Папка",
    });
  },
};
</script>

<script lang="ts" setup>
const props = defineProps<{ item: Folder }>();

const itemsStore = useItemsStore()

const selectFolder = () => {
  itemsStore.currentItemId = props.item.id;
};
</script>
