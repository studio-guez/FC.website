<template>
   <div v-if="block.type === 'gallery'" class="gallery mb-1" :class="{mobile: block.mobile}" :style="{color: block.color, '--gallery-scrollbar-color': block.color}">
      <header class="gallery-header">
         <h4 v-if="block.titleText" class="gallery-title">{{ block.titleText }}</h4>
         <div class="gallery-controls">
            <button @click="prevImage()" class="gallery-prev h4" aria-label="Previous image" :aria-controls="galleryId">←</button>
            <button @click="nextImage()" class="gallery-next h4" aria-label="Next image" :aria-controls="galleryId">→</button>
         </div>
      </header>
      <div class="gallery-strip" ref="gallery-strip">
         <div class="gallery-strip-inner" :id="galleryId" ref="gallery-images">
            <div v-for="(image, index) in block.images" :key="image.id" class="gallery-image" @click="openLightbox(block.images, index, block.color)">
               <div class="gallery-caption">{{ index + 1 }}/{{ block.images.length }}</div>
               <img :src="image.url" :srcset="image.srcset" sizes="60vh" :alt="image.alt" :width="image.width" :height="image.height">
            </div>
         </div>
      </div>
   </div>

   <Lightbox ref="lightbox"/>
</template>

<script setup lang="ts">
   import { onBeforeUnmount, onMounted, ref } from 'vue';
   import { useOverlayScrollbars } from "overlayscrollbars-vue";
   import LightboxVue from "Lightbox.vue";

   const props = defineProps(['block', 'lightbox']);
   const galleryStrip = useTemplateRef('gallery-strip');
   const galleryImages = useTemplateRef('gallery-images');
   let getScrollbarInstance;
   const galleryId = 'gallery-' + props.block.id;
   const lightbox = useTemplateRef("lightbox");
   let currentImage = 0;

   onMounted(() => {
      const [initGalleryOverlayScrollbars, getGalleryOverlayScrollbarsInstance] =
         useOverlayScrollbars({
            defer: true,
            options: {
               overflow: {
                  x: 'scroll',
                  y: 'hidden',
               },
               scrollbars: {
                  theme: 'gallery',
                  clickScroll: true,
               },
            },
         });

      initGalleryOverlayScrollbars(galleryStrip.value);
      getScrollbarInstance = getGalleryOverlayScrollbarsInstance
   });

   onBeforeUnmount(() => {
      const scrollbarInstance = getScrollbarInstance();
      if (scrollBarInstance) instance.destroy();
   });

   function openLightbox(images: any[], index: number, color: string) {
      lightbox.value?.openAt(images, index, color);
   }

   function nextImage() {
      const viewport = getScrollbarInstance()?.elements()?.viewport;
      const current = Array.from(galleryImages.value?.children).reduce((prev, curr) => {
         return Math.abs(viewport.scrollLeft - prev.offsetLeft) < Math.abs(viewport.scrollLeft - curr.offsetLeft) ? prev : curr;
      });
      const nextScrollPos = current?.nextElementSibling?.offsetLeft;

      if (nextScrollPos) {
         viewport?.scrollTo({ left: nextScrollPos, behavior: 'smooth' });
      }

      currentImage < props.block.images.length-1 ? currentImage++ : props.block.images.length-1;
   }

   function prevImage() {
      const viewport = getScrollbarInstance()?.elements()?.viewport;
      const current = Array.from(galleryImages.value?.children).reduce((prev, curr) => {
         return Math.abs(viewport.scrollLeft - prev.offsetLeft) < Math.abs(viewport.scrollLeft - curr.offsetLeft) ? prev : curr;
      });
      const prevScrollPos = current?.previousElementSibling?.offsetLeft;

      if (prevScrollPos !== undefined) {
         viewport?.scrollTo({left: prevScrollPos, behavior: 'smooth' });
      }

      currentImage > 0 ? currentImage-- : currentImage = 0;
   }
</script>
