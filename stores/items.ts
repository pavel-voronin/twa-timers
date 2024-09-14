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

type Live = {
  archived: false;
  archivedAt: null;
};
type Archived = {
  archived: true;
  archivedAt: number;
};

export type Item = {
  id: number;
  parentId?: number;
  name: string;
  createdAt: number;
  lastModified: number;
} & (Timer | Counter | Folder) &
  (Live | Archived);

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
      return [
        items.value.find((item) => item.id === currentItemId.value)!,
        ...items.value.filter((item) => item.parentId === currentItemId.value),
      ];
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
      archived: false,
      createdAt: now,
      lastModified: now,
      archivedAt: null,
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
      archived: false,
      createdAt: now,
      lastModified: now,
      archivedAt: null,
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
      archived: false,
      createdAt: now,
      lastModified: now,
      archivedAt: null,
    };

    items.value.push(newItem);
  };

  const startTimer = (timer: Item) => {
    if (timer.type === "timer" && !timer.running && !timer.archived) {
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

  const toggleArchive = (item: Item) => {
    if (!item.archived) {
      if (item.type === "timer") {
        stopTimer(item);
      }

      (item as unknown as Archived).archivedAt = Date.now();
    } else {
      (item as unknown as Live).archivedAt = null;
    }
    item.archived = !item.archived;
    item.lastModified = Date.now();
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
    const index = items.value.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
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

  setInterval(updateRunningTimers, 1000);

  const selectFolder = (folder: Item) => {
    if (folder.type === "folder") {
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
    toggleArchive,
    incrementCounter,
    decrementCounter,
    addNewFolder,
    deleteItem,
    selectFolder,
    quitFolder,
  };
});
