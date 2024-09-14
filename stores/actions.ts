export const useActionsStore = defineStore("actions", () => {
  const selectMode = ref(false);
  const selectedItems = ref<Item[]>([]);

  const addItem = (item: Item) => {
    selectedItems.value.push(item);
  };

  const removeItem = (item: Item) => {
    const index = selectedItems.value.findIndex((v) => v === item);
    if (index !== -1) {
      selectedItems.value.splice(index, 1);
    }
  };

  const clear = () => {
    selectedItems.value = [];
  };

  watch(
    () => useItemsStore().currentItem,
    () => {
      selectMode.value = false;
    }
  );

  watch(selectMode, (selectMode) => {
    if (!selectMode) {
      clear();
    }
  });

  return { selectMode, selectedItems, addItem, removeItem, clear };
});
