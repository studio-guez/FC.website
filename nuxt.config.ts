// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  app: {
    rootTag: 'body',
    head: {
      link: [{rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'}],
      script: [{
          src: 'https://www.googletagmanager.com/gtag/js?id=G-3B4K015HL3',
          async: true
        }, { innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-3B4K015HL3');
          `
        }
      ]
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
