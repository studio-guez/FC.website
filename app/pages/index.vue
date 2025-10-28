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

      window.addEventListener('wheel', (e) => {
         e.preventDefault();

         const activeCol = e.clientX < thresholdX ? splitScrollColumns.item(0) : splitScrollColumns.item(1);
         const targetCol = e.target.closest('.split-scroll .section');
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
               console.log(sectionTop, e.deltaY);
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
               console.log(delta);
               window.scrollBy(0, delta);
               return;
            }
         }

         // // Going up
         // if (e.deltaY < sectionTop && e.deltaY < 0) {

         //    if (sectionTop < 0) {
         //       window.scrollBy(0, sectionTop);
         //       delta -= sectionTop;
         //    }
         
         //    const leftToScroll = activeCol.scrollTop;

         //    if (delta < -leftToScroll) {
         //       activeCol.scrollBy(0, leftToScroll);
         //       delta -= leftToScroll;
         //       window.scrollBy(0, delta);
         //       delta = 0;
         //    } else {
         //       activeCol.scrollBy(0, delta);  
         //       delta = 0;
         //    }         
         // }

         // if (window.scrollY < 300 && e.deltaY < 0) {
         //    delta = delta / (300/window.scrollY);  
         // }
         
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