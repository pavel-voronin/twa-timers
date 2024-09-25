export type Item<T extends string = string> = {
  type: T;
  id: number;
  parentId: number | null;
  name: string;
  order: number;
};

export const useItemsStore = defineStore("items", () => {
  const items = useLocalStorage<Item[]>("items", []);
  const version = useLocalStorage<number>("version", 0);
  const currentItemId = ref(0) //useLocalStorage<number>("current_item_id", 0);
  const currentSubItem = useLocalStorage<string | null>(
    "current_subitem",
    null
  );

  function migrate() {
    if (version.value === 0) {
      items.value = [
        {
          type: "folder",
          id: 0,
          parentId: null,
          name: "",
          order: 0,
        },
        ...items.value.map((item) => ({
          ...item,
          parentId: (item.parentId as number | undefined) ?? 0,
          name: item.name,
          order: item.order ?? 0,
        })),
      ];

      currentItemId.value = 0;

      version.value = 1;
    }
  }

  migrate();

  const currentItem = computed(() => {
    const item = items.value.find((item) => item.id === currentItemId.value);

    if (item !== undefined) {
      return item;
    }

    console.log(`current_item_id was broken. Fallback to root`);
    currentItemId.value = 0;

    return items.value.find((item) => item.id === currentItemId.value)!;
  });

  const childrenItems = computed(() =>
    items.value
      .filter((item) => item.parentId === currentItemId.value)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  );

  function getNextItemName(baseName: string): string {
    const existingNames = childrenItems.value.map((i) => i.name);

    let index = 1;
    let newName = `${baseName} ${index}`;

    while (existingNames.includes(newName)) {
      index++;
      newName = `${baseName} ${index}`;
    }

    return newName;
  }

  function getNewId(): number {
    return items.value.length > 0
      ? Math.max(...items.value.map((i) => i.id)) + 1
      : 1;
  }

  function addNewItem<T extends Item = never>(
    item: Omit<T, "id" | "parentId" | "order">
  ) {
    const newItem: Item = {
      ...item,
      id: getNewId(),
      parentId: currentItemId.value,
      name: getNextItemName(item.name),
      order: childrenItems.value.length,
    };

    items.value.push(newItem);
  }

  const deleteItem = (item: Item) => {
    const deleteRecursively = (itemId: number) => {
      const index = items.value.findIndex((i) => i.id === itemId);

      if (index !== -1) {
        const children = items.value.filter((i) => i.parentId === itemId);

        children.forEach((child) => {
          deleteRecursively(child.id);
        });

        items.value.splice(index, 1);
      }
    };

    deleteRecursively(item.id);
  };

  const reorderItem = (oldIndex?: number, newIndex?: number) => {
    if (
      oldIndex === undefined ||
      newIndex === undefined ||
      newIndex === oldIndex
    ) {
      return;
    }

    const itemToMove = childrenItems.value[oldIndex];
    const targetItem = childrenItems.value[newIndex];

    itemToMove.order =
      (targetItem.order ?? 0) - 0.5 * Math.sign(oldIndex - newIndex);

    childrenItems.value
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .forEach((item, index) => {
        item.order = index;
      });
  };

  const moveItems = (_items: Item[], parent: Item) => {
    for (const item of _items) {
      item.parentId = parent.id;
      item.order = items.value.filter(
        (item) => item.parentId === parent.id
      ).length;
    }
  };

  const parent = (ofItem: Item): Item | null => {
    if (ofItem.parentId === null) {
      return null;
    }

    return items.value.find((item) => item.id === ofItem.parentId) ?? null;
  };

  const children = (ofItem: Item): Item[] => {
    return items.value.filter((item) => item.id === ofItem.id);
  };

  const go = (item: Item | null, subitem?: string) => {
    currentItemId.value = item?.id ?? 0;
    currentSubItem.value = subitem ?? null;
  };

  return {
    items: childrenItems,
    currentItem,
    currentSubItem,
    currentItemId,
    addNewItem,
    deleteItem,
    reorderItem,
    moveItems,

    parent,
    children,

    go,
  };
});
