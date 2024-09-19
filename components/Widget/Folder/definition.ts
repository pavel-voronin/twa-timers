export type Folder = Item<"folder">

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