export type Item<T extends string = string> = {
  type: T;
  id: number;
  parentId?: number;
  name: string;
  createdAt: number;
  lastModified: number;
};

export type WidgetConfig = {
  name: string;
  label: string;
  add: () => void;
  init?: (item: any) => void;
  destroy?: (item: any) => void;
};

type StoredWidget = {
  config: WidgetConfig;
  widget: Component;
};

export const useItemsStore = defineStore("items", () => {
  const widgets = ref<Record<string, StoredWidget>>(
    Object.fromEntries(
      Object.entries(
        import.meta.glob("../components/Widget/*.vue", {
          eager: true,
        })
      ).map(([_, v]: any) => [
        v.config.name,
        { config: v.config, widget: shallowRef(v.default) },
      ])
    )
  );

  const items = useLocalStorage<Item[]>("items", []);
  items.value.forEach((item) => {
    if (item.type in widgets.value && widgets.value[item.type].config.init) {
      widgets.value[item.type].config.init!(item);
    }
  });

  const currentItemId = useLocalStorage<number | null>(
    "current_item_id",
    null,
    {
      serializer: NumberSerializer,
    }
  );

  const currentItem = computed(() => {
    return items.value.find((item) => item.id === currentItemId.value);
  });

  const filteredItems = computed(() => {
    if (currentItemId.value) {
      return items.value.filter(
        (item) => item.parentId === currentItemId.value
      );
    } else {
      return items.value.filter((item) => item.parentId === undefined);
    }
  });

  const getNextItemName = (baseName: string) => {
    const existingNames = filteredItems.value.map((i) => i.name);

    let index = 1;
    let newName = `${baseName} ${index}`;

    while (existingNames.includes(newName)) {
      index++;
      newName = `${baseName} ${index}`;
    }

    return newName;
  };

  const getNewId = (): number =>
    items.value.length > 0 ? Math.max(...items.value.map((i) => i.id)) + 1 : 1;

  const addNewItem = <T extends Item = never>(
    item: Omit<T, "id" | "parentId" | "createdAt" | "lastModified">
  ) => {
    const now = Date.now();

    const newItem: Item = {
      ...item,
      id: getNewId(),
      parentId: currentItemId.value ?? undefined,
      name: getNextItemName(item.name),
      createdAt: now,
      lastModified: now,
    };

    const length = items.value.push(newItem);
    if (
      newItem.type in widgets.value &&
      widgets.value[newItem.type].config.init
    ) {
      widgets.value[newItem.type].config.init!(items.value[length - 1]);
    }
  };

  const deleteItem = (item: Item) => {
    const deleteRecursively = (itemId: number) => {
      const index = items.value.findIndex((i) => i.id === itemId);

      if (index !== -1) {
        const type = items.value[index].type;
        const children = items.value.filter((i) => i.parentId === itemId);

        children.forEach((child) => {
          deleteRecursively(child.id);
        });

        items.value.splice(index, 1);
        if (type in widgets.value && widgets.value[type].config.destroy) {
          widgets.value[type].config.destroy!(items.value[index]);
        }
      }
    };

    deleteRecursively(item.id);
  };

  return {
    widgets,

    items: filteredItems,
    currentItem,
    currentItemId,
    addNewItem,
    deleteItem,
  };
});
