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

      window.addEventListener('wheel', (e) => {
         const originalColumn = e.target.closest('.split-scroll > .section');
         const col = activeColumn() ?? originalColumn;
         const sectionPos = splitScrollSection.getBoundingClientRect();

         if (e.deltaY > sectionPos.top && e.deltaY > 0) {   
            let delta = e.deltaY;

            if (col) {
               disableMainScroll();

               if (sectionPos.top > 0) {
                  window.scrollBy(0, sectionPos.top);
                  delta -= sectionPos.top;
               }
            
               const leftToScroll = col.scrollHeight - col.scrollTop - window.innerHeight;

               if (e.deltaY > leftToScroll) {
                  enableMainScroll();
                  col.scrollBy(0, leftToScroll);
                  delta -= leftToScroll;
                  window.scrollBy(0, e.deltaY);
               }

               col.scrollBy(0, e.deltaY);
            }
         }

         else if (e.deltaY < sectionPos.top && e.deltaY < 0) {
            let delta = e.deltaY;

            if (col) {
               disableMainScroll();

               if (sectionPos.top < 0) {
                  window.scrollBy(0, sectionPos.top);
                  delta -= sectionPos.top;
               }
            
               const leftToScroll = col.scrollTop;

               if (delta < -leftToScroll) {
                  enableMainScroll();
                  col.scrollBy(0, leftToScroll);
                  delta -= leftToScroll;
                  window.scrollBy(0, delta);
               }

               col.scrollBy(0, delta);  
            }
         }

         else {
            enableMainScroll();
         }

      });

      const activeColumn = (function() {
         const activeColumns = Array(splitScrollColumns.length);
         splitScrollColumns.forEach((column, i) => {
            column.addEventListener('mouseenter', () => {
               activeColumns[i] = true;
            });
            column.addEventListener('mouseleave', () => {
               activeColumns[i] = false;
            });
         });

         return function() {
            const activeColumnIdx = activeColumns.indexOf(true);

            if (activeColumnIdx === -1) {
               return null;
            } else {
               return splitScrollColumns.item(activeColumnIdx);
            }
         }
      })();

      function disableMainScroll() {
         document.body.classList.add('no-scroll');
      }

      function enableMainScroll() {
         document.body.classList.remove('no-scroll');
      }
   });

</script>