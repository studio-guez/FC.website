<template>
  <Head>
    <Style>
      :root {
        --scrollbar-color: {{ scrollbarColor }};
      }
    </Style>
  </Head>
  <Header :color="data?.result?.color"/>
  <NuxtPage/>
</template>

<script setup lang="ts">
  import 'overlayscrollbars/overlayscrollbars.css';
  import { useOverlayScrollbars } from "overlayscrollbars-vue";
  import { onMounted } from 'vue';
  const route = useRoute();

  const body = {
    _version: route.query._version,
    query: 'site',
    select: {
      color: 'site.header_color',
    }
  }

  const {data, status} = await useFetch('/api/CMS_KQLRequest', {
    lazy: true,
    method: 'POST',
    body: JSON.stringify(body),
  });

  const scrollbarColor = data.value.result.color;
  const [initBodyOverlayScrollbars] = useOverlayScrollbars({
     defer: true,
     options: {
        scrollbars: {
           theme: 'body',
           clickScroll: true,
        },
     },
  });

  onMounted(() => {
    // Show mobile navigation when scrolling up
   const mobileNav = document.querySelector('.mobile-nav');
	let lastScrollTop = 0;
	let deltaY;

	window.addEventListener("scroll", function() {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		deltaY = scrollTop - lastScrollTop;
		lastScrollTop = scrollTop;
		
		mobileNav.classList.toggle('active', deltaY < 0 && window.scrollY > 200);
	}, false);

   // Init custom scrollbars
   initBodyOverlayScrollbars({
      target: document.body,
      cancel: {
         body: null,
      },
   });
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
    --os-handle-bg: var(--scrollbar-color);
    --os-handle-bg-hover: var(--scrollbar-color);
    --os-handle-bg-active: var(--scrollbar-color);
  }
</style>
