<template>
  <Header/>
  <NuxtPage/>
</template>

<script setup lang="ts">
  import 'overlayscrollbars/overlayscrollbars.css';
  import { useOverlayScrollbars } from "overlayscrollbars-vue";
  import { onMounted } from 'vue';

  onMounted(() => {
    // Show mobile navigation when scrolling up
    const mobileNav = document.querySelector('.mobile-nav');

    window.addEventListener('wheel', (e) => {
      mobileNav.classList.toggle('active', e.deltaY < 0 && window.scrollY > 200);
    });

   // Init custom scrollbars
      const [initBodyOverlayScrollbars, getBodyOverlayScrollbarsInstance] =
      useOverlayScrollbars({
         defer: true,
         options: {
            scrollbars: {
               theme: 'body',
               clickScroll: true,
            },
         },
      });

      initBodyOverlayScrollbars(document.body);
   });

</script>

<style>
  .os-scrollbar {
    --os-size: 10px;
    --os-padding-perpendicular: 2px;
    --os-padding-axis: 2px;
    --os-track-border-radius: 10px;
    --os-handle-interactive-area-offset: 4px;
    --os-handle-border-radius: 10px;
  }

  .os-scrollbar.body {
    --os-handle-bg: #27bc9c;
    --os-handle-bg-hover: #27bc9c;
    --os-handle-bg-active: #27bc9c;
  }
</style>