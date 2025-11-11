<template>
	<Head>
    <Title>{{ data?.result.title }}</Title>
  </Head>
	<main class="site-main">
      <Section id="intro" />
      <div class="split-scroll mb-2">
         <Section id="experiences" />
         <Section id="objects" />
      </div>
      <Section id="outro" />
	</main>
</template>

<script setup lang="ts">
   import 'overlayscrollbars/overlayscrollbars.css';
   import { useOverlayScrollbars } from "overlayscrollbars-vue";
   import { onMounted } from 'vue'

   const body = {
      query: 'site',
      select: {
         title: true,
      }
   }

   const {data, status} = await useFetch('/api/CMS_KQLRequest', {
      lazy: true,
      method: 'POST',
      body: JSON.stringify(body),
   });

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

   


   onMounted(() => {
      const splitScrollSection = document.querySelector('.split-scroll');
      const splitScrollColumns = document.querySelectorAll('.split-scroll > *');
      const scrollbarInstances = [];
      const thresholdX = splitScrollColumns.item(0).getBoundingClientRect().right;

      initBodyOverlayScrollbars(document.body);

      splitScrollColumns.forEach(col => {
         const [initColOverlayScrollbars, getColOverlayScrollbarsInstance] =
         useOverlayScrollbars({
            defer: true,
            options: {
               elements: {
                  viewport: splitScrollSection
               },
               scrollbars: {
                  theme: 'section',
                  clickScroll: true,
               },
            },
         });

         initColOverlayScrollbars(col);
         scrollbarInstances.push(getColOverlayScrollbarsInstance);
      });
      

      

      window.addEventListener('wheel', (e) => {
         e.preventDefault();

         // Currently hovered column
         const activeColIdx = e.clientX < thresholdX ? 0 : 1;
         // const activeCol = splitScrollColumns.item(activeColIdx);
         const activeCol = scrollbarInstances[activeColIdx]().elements().viewport;

         // const targetCol = e.target.closest('.split-scroll .section');
         const sectionTop = splitScrollSection.offsetTop - window.scrollY;
         let delta = e.deltaY;
         
         // Going down
         if (e.deltaY > sectionTop && e.deltaY > 0) {   
            
            if (sectionTop > 0) {
               window.scrollBy(0, sectionTop);
               delta -= sectionTop;
            }
         
            const leftToScroll = activeCol.scrollHeight - activeCol.scrollTop - window.innerHeight;

            if (e.deltaY > leftToScroll) {
               activeCol.scrollBy(0, leftToScroll);
               delta -= leftToScroll;
               window.scrollBy(0, delta);
               delta = 0;
            }

            activeCol.scrollBy(0, delta);
            delta = 0;
         }

         // Going up
         if (e.deltaY < 0) {

            if (sectionTop < 0) {
               window.scrollBy(0, Math.max(sectionTop, e.deltaY));
               return;
            }

            if (sectionTop == 0) {
               activeCol.scrollBy(0, e.deltaY);
               const overflow = e.deltaY + activeCol.scrollTop;
               if (overflow < 0) {
                  activeCol.scrollBy(0, -activeCol.scrollTop);
                  window.scrollBy(0, overflow);
               }
               return;  
            }

            if (sectionTop > 0) {
               let delta = e.deltaY;
               if (window.scrollY < 300 && e.deltaY < 0) {
                  delta = delta/6 + delta / (300/window.scrollY);  
               }
               window.scrollBy(0, delta);
               return;
            }
         }
         
         window.scrollBy(0, delta);

      }, {passive: false});
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

.os-scrollbar.section {
   --os-handle-bg: #f36000;
   --os-handle-bg-hover: #f36000;
   --os-handle-bg-active: #f36000;
}
</style>