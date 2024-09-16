import type WebApp from "@twa-dev/sdk";

declare global {
  interface Window {
    Telegram: {
      WebApp: typeof WebApp;
    };
  }
}

export {};
