type Counter = {
  type: "counter";
  count: number;
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
  name: string;
  createdAt: number;
  lastModified: number;
  projectId?: number | null;
} & (Timer | Counter) &
  (Live | Archived);

export type Project = {
  id: number;
  name: string;
};

export const useItemsStore = defineStore("items", () => {
  const projectsStore = useProjectsStore();

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

  const selectedItems = computed(() => {
    return items.value.filter((item) =>
      projectsStore.currentProject
        ? item.projectId === projectsStore.currentProject.id
        : item.projectId === null || item.projectId === undefined
    );
  });

  const getNextItemName = (type: Item["type"]) => {
    const existingNames = selectedItems.value
      .filter((i) => i.type === type)
      .map((i) => i.name);
    let index = 1;
    let newName = `${type === "timer" ? "Таймер" : "Счетчик"} ${index}`;
    while (existingNames.includes(newName)) {
      index++;
      newName = `${type === "timer" ? "Таймер" : "Счетчик"} ${index}`;
    }
    return newName;
  };

  const addNewTimer = () => {
    const newId =
      items.value.length > 0
        ? Math.max(...items.value.map((i) => i.id)) + 1
        : 1;
    const now = Date.now();
    const newItem: Item = {
      id: newId,
      type: "timer",
      name: getNextItemName("timer"),
      archived: false,
      createdAt: now,
      lastModified: now,
      archivedAt: null,
      elapsedTime: 0,
      running: false,
      lastStartTime: null,
      projectId: projectsStore.currentProject? projectsStore.currentProject.id : null,
    };

    items.value.push(newItem);
  };

  const addNewCounter = () => {
    const newId =
      items.value.length > 0
        ? Math.max(...items.value.map((i) => i.id)) + 1
        : 1;
    const now = Date.now();
    const newItem: Item = {
      id: newId,
      type: "counter",
      count: 0,
      name: getNextItemName("counter"),
      archived: false,
      createdAt: now,
      lastModified: now,
      archivedAt: null,
      projectId: projectsStore.currentProject? projectsStore.currentProject.id : null,
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

  return {
    items: selectedItems,
    addNewTimer,
    addNewCounter,
    startTimer,
    stopTimer,
    toggleArchive,
    incrementCounter,
    decrementCounter,
    deleteItem,
  };
});
