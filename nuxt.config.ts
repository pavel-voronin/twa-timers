// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt", "@nuxt/icon"],
  app: {
    head: {
      script: [
        {
          src: "/telegram-web-app.js",
          type: "text/javascript",
          fetchpriority: "high",
        },
      ],
    },
  },
  nitro: {
    preset: process.env.NITRO_PRESET || "node-server",
    imports: {
      dirs: ["./types/**/*", "./types"],
    },
  },
});
