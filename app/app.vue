<template>
  <Header/>
  <NuxtPage/>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue';

  onMounted(() => {
    const mobileNav = document.querySelector('.mobile-nav');

    window.addEventListener('wheel', (e) => {
      mobileNav.classList.toggle('active', e.deltaY < 0 && window.scrollY > 200);
    });
  });

</script>