type Counter = {
  type: "counter";
  count: number;
};

type Folder = {
  type: "folder";
};

type RunningTimer = {
  running: true;
  lastStartTime: number;
};

type StoppedTimer = {
  running: false;
  lastStartTime: null;
};

type Timer = {
  type: "timer";
  elapsedTime: number;
} & (RunningTimer | StoppedTimer);

export type Item = {
  id: number;
  parentId?: number;
  name: string;
  createdAt: number;
  lastModified: number;
} & (Timer | Counter | Folder);

export const useItemsStore = defineStore("items", () => {
  const items = useLocalStorage<Item[]>("items", []);
  if (items) {
    const now = Date.now();

    items.value.forEach((item) => {
      if (item.type === "timer" && item.running) {
        item.elapsedTime += now - item.lastStartTime;
        item.lastStartTime = now;
      }
    });
  }

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

  const getNextItemName = (type: Item["type"]) => {
    const typeNames: { [key in Item["type"]]: string } = {
      timer: "Таймер",
      counter: "Счетчик",
      folder: "Папка",
    };

    const existingNames = filteredItems.value
      .filter((i) => i.type === type)
      .map((i) => i.name);

    let index = 1;
    let newName = `${typeNames[type]} ${index}`;

    while (existingNames.includes(newName)) {
      index++;
      newName = `${typeNames[type]} ${index}`;
    }

    return newName;
  };

  function getNewId() {
    return items.value.length > 0
      ? Math.max(...items.value.map((i) => i.id)) + 1
      : 1;
  }

  const addNewTimer = () => {
    const newId = getNewId();
    const now = Date.now();

    const newItem: Item = {
      id: newId,
      parentId: currentItemId.value ?? undefined,
      type: "timer",
      name: getNextItemName("timer"),
      createdAt: now,
      lastModified: now,
      elapsedTime: 0,
      running: false,
      lastStartTime: null,
    };

    items.value.push(newItem);
  };

  const addNewCounter = () => {
    const newId = getNewId();
    const now = Date.now();

    const newItem: Item = {
      id: newId,
      parentId: currentItemId.value ?? undefined,
      type: "counter",
      count: 0,
      name: getNextItemName("counter"),
      createdAt: now,
      lastModified: now,
    };

    items.value.push(newItem);
  };

  const addNewFolder = () => {
    const newId = getNewId();
    const now = Date.now();

    const newItem: Item = {
      id: newId,
      parentId: currentItemId.value ?? undefined,
      type: "folder",
      name: getNextItemName("folder"),
      createdAt: now,
      lastModified: now,
    };

    items.value.push(newItem);
  };

  const startTimer = (timer: Item) => {
    if (timer.type === "timer" && !timer.running) {
      (timer as unknown as RunningTimer).running = true;
      (timer as unknown as RunningTimer).lastStartTime = Date.now();
    }
  };

  const stopTimer = (timer: Item) => {
    if (timer.type == "timer" && timer.running) {
      (timer as unknown as StoppedTimer).running = false;
      timer.elapsedTime += Date.now() - timer.lastStartTime;
      (timer as unknown as StoppedTimer).lastStartTime = null;
      timer.lastModified = Date.now();
    }
  };

  const incrementCounter = (counter: Item) => {
    if (counter.type === "counter") {
      counter.count++;
      counter.lastModified = Date.now();
    }
  };

  const decrementCounter = (counter: Item) => {
    if (counter.type === "counter") {
      if (counter.count > 0) {
        counter.count--;
        counter.lastModified = Date.now();
      }
    }
  };

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

  const updateRunningTimers = () => {
    const now = Date.now();
    items.value.forEach((item) => {
      if (item.type === "timer" && item.running) {
        item.elapsedTime = item.elapsedTime + (now - item.lastStartTime);
        item.lastStartTime = now;
      }
    });
  };

  setInterval(updateRunningTimers, 500);

  const selectFolder = (folder?: Item) => {
    if (folder === undefined) {
      currentItemId.value = null;
    } else if (folder.type === "folder") {
      currentItemId.value = folder.id;
    }
  };

  const quitFolder = (folder: Item) => {
    if (folder.type === "folder") {
      currentItemId.value = folder.parentId ?? null;
    }
  };

  return {
    items: filteredItems,
    currentItem,
    addNewTimer,
    addNewCounter,
    startTimer,
    stopTimer,
    incrementCounter,
    decrementCounter,
    addNewFolder,
    deleteItem,
    selectFolder,
    quitFolder,
  };
});
