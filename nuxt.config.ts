// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    rootTag: 'body',
    head: {
      link: [{rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'}]
    }
  },
  vue: {
    compilerOptions: {
      comments: false,
    },
  },
  css: ['~/assets/css/reset.css', '~/assets/css/main.css'],
  devtools: { enabled: true },
  runtimeConfig: {
    apiAuthEmail: '',
    apiAuthPassword: '',
    apiUrl: '',
  },
})
