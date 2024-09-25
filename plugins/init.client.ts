export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    const WebApp = window.Telegram.WebApp;

    nuxtApp.hook("app:created", async () => {
      if (!WebApp.initDataUnsafe?.user) {
        console.log("Ты точно в телеге?");
      }

      WebApp.ready();
      WebApp.disableVerticalSwipes();
      // WebApp.setHeaderColor("#f9fafb");
      // WebApp.setBackgroundColor("#f9fafb");

      useTelegram().setWebApp(WebApp);
    });
  }
});
