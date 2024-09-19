export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("items", useItemsStore());
  nuxtApp.provide("widgets", useWidgetsStore());
  nuxtApp.provide("actions", useActionsStore());
});

declare module "vue" {
  interface ComponentCustomProperties {
    $items: ReturnType<typeof useItemsStore>;
    $widgets: ReturnType<typeof useWidgetsStore>;
    $actions: ReturnType<typeof useActionsStore>;
  }
}
