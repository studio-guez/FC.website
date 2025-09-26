// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['~/assets/css/reset.css', '~/assets/css/main.css'],
  devtools: { enabled: true },
  runtimeConfig: {
    apiAuthEmail: '',
    apiAuthPassword: '',
    apiUrl: '',
  },
})
