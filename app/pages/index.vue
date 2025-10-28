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

   onMounted(() => {
      const splitScrollSection = document.querySelector('.split-scroll');
      const splitScrollColumns = document.querySelectorAll('.split-scroll > *');
      const thresholdX = splitScrollColumns.item(0).getBoundingClientRect().right;

      document.addEventListener('wheel', (e) => {
         e.preventDefault();

         const col = e.clientX < thresholdX ? splitScrollColumns.item(0) : splitScrollColumns.item(1);
         const sectionPos = splitScrollSection.getBoundingClientRect();
         let delta = e.deltaY;

         if (delta > sectionPos.top && delta > 0) {   
            if (col) {
               if (sectionPos.top > 0) {
                  window.scrollBy(0, sectionPos.top);
                  delta -= sectionPos.top;
               }
            
               const leftToScroll = col.scrollHeight - col.scrollTop - window.innerHeight;

               if (delta > leftToScroll) {
                  col.scrollBy(0, leftToScroll);
                  delta -= leftToScroll;
                  window.scrollBy(0, delta);
                  delta = 0;
               }

               col.scrollBy(0, delta);
               delta = 0;
            }
         }

         if (delta < sectionPos.top && delta< 0) {
            if (col) {
               if (sectionPos.top < 0) {
                  window.scrollBy(0, sectionPos.top);
                  delta -= sectionPos.top;
               }
            
               const leftToScroll = col.scrollTop;

               if (delta < -leftToScroll) {
                  col.scrollBy(0, leftToScroll);
                  delta -= leftToScroll;
                  window.scrollBy(0, delta);
                  delta = 0;
               }

               col.scrollBy(0, delta);
               delta = 0;
            }
         }

         window.scrollBy(0, delta);

      }, {passive: false});

      function disableMainScroll() {
         document.body.classList.add('no-scroll');
      }

      function enableMainScroll() {
         document.body.classList.remove('no-scroll');
      }
   });

</script>