import type WebApp from "@twa-dev/sdk";

const webAppRef: Ref<typeof WebApp | null> = ref(null);
const isInitializedRef = ref(false);

export const useTelegram = () => {
  const setWebApp = (webApp: any) => {
    webAppRef.value = webApp;
    isInitializedRef.value = true;
  };

  const waitForInitialization = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (isInitializedRef.value) {
        resolve(true);
      } else {
        const unwatch = watch(isInitializedRef, (newValue) => {
          if (newValue) {
            unwatch();
            resolve(true);
          }
        });
      }
    });
  };

  function haptic(style: "light" | "medium" | "heavy" | "rigid" | "soft") {
    window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
  }

  const platform = computed(() => window.Telegram.WebApp.platform);

  return {
    webApp: webAppRef,
    isInitialized: isInitializedRef,
    setWebApp,
    waitForInitialization,
    haptic,
    platform,
  };
};

export type { WebApp };
