<template>
    <div class="split-scroll mb-2" ref="el">
      <div class="split-scroll-col">
         <slot name="left"></slot>
      </div>
      <div class="split-scroll-col">
         <slot name="right"></slot>
      </div>
    </div>
</template>

<script setup lang="ts">
   import 'overlayscrollbars/overlayscrollbars.css';
   import { useOverlayScrollbars } from "overlayscrollbars-vue";
   import { useTemplateRef, onMounted } from 'vue';

   const el = useTemplateRef('el');
   const props = defineProps(['color']);

   onMounted(() => {
      const splitScrollSections = document.querySelectorAll('.split-scroll');
      const splitScrollColumns = el.value.querySelectorAll('.split-scroll-col');
      let thresholdX = splitScrollColumns.item(0).getBoundingClientRect().right;
      let scrollbarInstances = [];
      const mediaQuery = window.matchMedia("(max-width: 920px)");
      
      window.addEventListener('resize', (e) => {
         thresholdX = splitScrollColumns.item(0).getBoundingClientRect().right;
      });

      function toggleSplitScroll() {
         if (mediaQuery.matches) {
            destroySplitScroll();
         } else {
            initSplitScroll();
         }
      }

      toggleSplitScroll();

      mediaQuery.addListener(toggleSplitScroll);

      function initSplitScroll() {
         window.addEventListener('wheel', handleWheel, {passive: false});

         splitScrollColumns.forEach(col => {
            const [initColOverlayScrollbars, getColOverlayScrollbarsInstance] =
            useOverlayScrollbars({
               defer: true,
               options: {
                  elements: {
                     viewport: el.value
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
      }

      function getClosestToViewport(els) {
         const viewportCenter = window.innerHeight/2;
         let minDistance = Infinity;
         let closestElement = null;

         els.forEach(el => {
            const rect = el.getBoundingClientRect();
            const elCenter = rect.top + rect.height/2;
            const distance = Math.abs(viewportCenter - elCenter);
            if (distance < minDistance) {
               minDistance = distance;
               closestElement = el;
            }
         });

         return closestElement;
      }

      function destroySplitScroll() {
         window.removeEventListener('wheel', handleWheel);
         
         scrollbarInstances.forEach(instance => {
            instance().destroy();
         });
         scrollbarInstances = [];
      }

      function handleWheel(e) {
         // Blocks scrolling when lightbox is open
         if (document.body.dataset.lightboxOpen === 'true') {
            e.preventDefault();
            return;
         };

         // Don't prevent horizontal scrolling
         const isHorizontalScroll = Math.abs(e.deltaX) > Math.abs(e.deltaY);
         if (isHorizontalScroll) return;

         e.preventDefault();

         const closestSection = getClosestToViewport(splitScrollSections);
         if (closestSection !== el.value) return;

         // Currently hovered column
         const activeColIdx = e.clientX < thresholdX ? 0 : 1;
         const activeCol = scrollbarInstances[activeColIdx]().elements().viewport;

         const sectionTop = el.value.offsetTop - window.scrollY;
         let delta = e.deltaY;

         // Scrolling down
         if (e.deltaY > 0) {
            if (e.deltaY > sectionTop && sectionTop > -10) {
               window.scrollBy(0, sectionTop);
               delta -= sectionTop;
               
               
               const leftToScroll = activeCol.scrollHeight - activeCol.scrollTop - window.innerHeight;
               if (delta < leftToScroll) {
                  activeCol.scrollBy(0, delta);
               } else {
                  activeCol.scrollBy(0, leftToScroll);
                  delta -= leftToScroll;
                  window.scrollBy(0, delta);
               }
            } else {
               window.scrollBy(0, e.deltaY);
            }
         }

         // Scrolling up
         if (e.deltaY < 0) {
            if (e.deltaY < sectionTop && sectionTop < 10) {
               window.scrollBy(0, sectionTop);
               delta -= sectionTop;

               const leftToScroll = activeCol.scrollTop;

               if (Math.abs(delta) < leftToScroll) {
                  activeCol.scrollBy(0, delta);
               } else {
                  activeCol.scrollBy(0, -leftToScroll);
                  delta += leftToScroll;
                  window.scrollBy(0, delta);
               }
            } else {
               window.scrollBy(0, e.deltaY);
            }
         }
      };
   });
</script>

<style>
   .os-scrollbar.section {
      --os-handle-bg: v-bind(props.color);
      --os-handle-bg-hover: v-bind(props.color);
      --os-handle-bg-active: v-bind(props.color);
   }
</style>
