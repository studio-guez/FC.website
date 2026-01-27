<template>
   <ClientOnly>
      <teleport to="body">
         <div v-if="open" class="lightbox" :style="{ color }" @click.self="close">
            <button class="lightbox-close" type="button" aria-label="Close" @click="close">✗</button>
            <img
               class="lightbox-image"
               :src="images[index]?.url"
               :srcset="images[index]?.srcset"
               sizes="100vw"
               :alt="images[index]?.alt"
            >
            <div class="lightbox-caption">{{ index + 1 }}/{{ images.length }}</div>
         </div>
      </teleport>
   </ClientOnly>
</template>

<script setup lang="ts">
   import { onBeforeUnmount, onMounted, ref } from 'vue';

   const open = ref(false);
   const images = ref<any[]>([]);
   const index = ref(0);
   const color = ref<string | null>(null);

   function openAt(nextImages: any[], nextIndex: number, nextColor: string | null) {
      images.value = nextImages || [];
      index.value = nextIndex || 0;
      color.value = nextColor || null;
      open.value = true;
      document.body.dataset.lightboxOpen = 'true';
   }

   function close() {
      open.value = false;
      color.value = null;
      delete document.body.dataset.lightboxOpen;
   }

   function next() {
      index.value = (index.value + 1) % images.value.length;
   }

   function prev() {
      index.value = (index.value - 1 + images.value.length) % images.value.length;
   }

   function onKeyDown(e: KeyboardEvent) {
      if (!open.value) return;
      if (e.key === 'Escape') {
         close();
         return;
      }
      if (e.key === 'ArrowRight') {
         e.preventDefault();
         next();
      }
      if (e.key === 'ArrowLeft') {
         e.preventDefault();
         prev();
      }
   }

   onMounted(() => {
      window.addEventListener('keydown', onKeyDown);
   });

   onBeforeUnmount(() => {
      window.removeEventListener('keydown', onKeyDown);
      delete document.body.dataset.lightboxOpen;
   });

   defineExpose({
      openAt,
      close,
      next,
      prev,
   });
</script>
