export type WidgetConfig = {
  name: string;
  label: string;
  canContain: boolean;
  add: () => void;
};

export const useWidgetsStore = defineStore("widgets", () => {
  const widgets = ref<Record<string, WidgetConfig>>(
    Object.fromEntries(
      Object.entries(
        import.meta.glob("../components/Widget/*/definition.ts", {
          eager: true,
        })
      ).map(([_, v]: any) => [v.config.name, v.config])
    )
  );

  return {
    widgets,
  };
});
