export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide("items", useItemsStore());
});

declare module "vue" {
  interface ComponentCustomProperties {
    $items: ReturnType<typeof useItemsStore>;
  }
}
