<template>
   <section class="section mb-2">
      <template v-for="block of props.blocks">
         <!-- Text -->
         <div v-if="block.type === 'text'" class="text mb-1" :class="{mobile: block.mobile}" v-html="block.text" :style="{color: block.color}"/>

         <!-- Image -->
         <div v-if="block.type === 'image'" class="image mb-1" :class="{mobile: block.mobile}" :style="{color: block.color, borderRadius: `${block.cornerRadius*5}px`}">
            <img :src="block.image.url" :alt="block.image.alt">
         </div>

         <!-- File -->
         <div v-if="block.type === 'file'" class="file mb-1" :class="{mobile: block.mobile}" :style="{color: block.color}">
            <a :href="block.file.url" target="_blank">{{ block.label }}</a>
         </div>

         <!-- Link -->
         <div v-if="block.type === 'link'" class="link mb-1" :class="{mobile: block.mobile}" :style="{color: block.color}">
            <a :href="block.url" target="_blank">{{ block.label }}</a>
         </div>

         <!-- Video -->
         <div v-if="block.type === 'video'" class="video mb-1" :class="{mobile: block.mobile}" :style="{color: block.color}">
            <h4 v-if="block.titleText" class="mb-1">{{ block.titleText }}</h4>
            <video controls :src="block.video.url" />
         </div>

         <!-- Gallery -->
         <div v-if="block.type === 'gallery'" class="gallery mb-1" :class="{mobile: block.mobile}" :style="{color: block.color, '--gallery-scrollbar-color': block.color}">
            <h4 v-if="block.titleText" class="gallery-title">{{ block.titleText }}</h4>
            <div class="gallery-strip" ref="galleryStrips">
               <div class="gallery-strip-inner">
               <div v-for="(image, index) in block.images" :key="image.id" class="gallery-image" @click="openLightbox(block.images, index, block.color)">
                  <div class="gallery-caption">{{ index + 1 }}/{{ block.images.length }}</div>
                  <img :src="image.url" :srcset="image.srcset" sizes="60vh" :alt="image.alt">
               </div>
            </div>
         </div>
         </div>

         <!-- Subsections -->
          <section v-if="block.type === 'subsection'" class="subsection mb-1">
            <SubSection :header="block.title[0]" :blocks="block.content"/>
          </section>

         <!-- Separator -->
         <hr v-if="block.type === 'hr'" class="hr mb-1" :class="{mobile: block.mobile}" :style="{color: block.color}" />

         <!-- Newsletter -->
         <div v-if="block.type === 'newsletter'" class="newsletter mb-1" :style="{color: block.color}">
            <Newsletter/>
         </div>

      </template>

      <ClientOnly>
         <teleport to="body">
            <div v-if="lightboxOpen" class="lightbox" :style="{ color: lightboxColor }" @click.self="closeLightbox">
               <button class="lightbox-close" type="button" aria-label="Close" @click="closeLightbox">✗</button>
               <img class="lightbox-image" :src="lightboxImages[lightboxIndex]?.url" :srcset="lightboxImages[lightboxIndex]?.srcset" sizes="100vw" :alt="lightboxImages[lightboxIndex]?.alt">
               <div class="lightbox-caption">{{ lightboxIndex + 1 }}/{{ lightboxImages.length }}</div>
            </div>
         </teleport>
      </ClientOnly>
   </section>
</template>

<script setup lang="ts">
   import { onBeforeUnmount, onMounted, ref } from 'vue';
   import { useOverlayScrollbars } from "overlayscrollbars-vue";

   const props = defineProps(['blocks']);
   const galleryStrips = ref<HTMLElement[]>([]);
   const galleryScrollbars: Array<() => any> = [];
   const lightboxOpen = ref(false);
   const lightboxImages = ref<any[]>([]);
   const lightboxIndex = ref(0);
   const lightboxColor = ref<string | null>(null);

   onMounted(() => {
      galleryStrips.value.forEach((el) => {
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

         initGalleryOverlayScrollbars(el);
         galleryScrollbars.push(getGalleryOverlayScrollbarsInstance);
      });
   });

   function openLightbox(images: any[], index: number, color: string) {
      lightboxImages.value = images || [];
      lightboxIndex.value = index || 0;
      lightboxColor.value = color || null;
      lightboxOpen.value = true;
      document.body.dataset.lightboxOpen = 'true';
   }

   function closeLightbox() {
      lightboxOpen.value = false;
      lightboxColor.value = null;
      delete document.body.dataset.lightboxOpen;
   }

   function onKeyDown(e: KeyboardEvent) {
      if (!lightboxOpen.value) return;
      if (e.key === 'Escape') {
         closeLightbox();
         return;
      }
      if (e.key === 'ArrowRight') {
         e.preventDefault();
         lightboxIndex.value = (lightboxIndex.value + 1) % lightboxImages.value.length;
      }
      if (e.key === 'ArrowLeft') {
         e.preventDefault();
         lightboxIndex.value =
            (lightboxIndex.value - 1 + lightboxImages.value.length) % lightboxImages.value.length;
      }
   }

   onMounted(() => {
      window.addEventListener('keydown', onKeyDown);
   });

   onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKeyDown);
      delete document.body.dataset.lightboxOpen;
      galleryScrollbars.forEach((getInstance) => {
         const instance = getInstance();
         if (instance) instance.destroy();
      });
   });
</script>
