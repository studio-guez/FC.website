<template>
   <div
      class="banner mb-1"
      :style="{backgroundColor: props.block.color}"
   >
      <a :href="props.block.link" class="banner-link">
         <div
            class="banner-track"
            :style="{ transform: `translateX(${offset}px)` }"
         >
            <div ref="firstIcons" class="banner-icons" v-html="props.block.icons"></div>
            <div class="banner-text" v-html="props.block.text"></div>
            <div ref="secondIcons" class="banner-icons" aria-hidden="true" v-html="props.block.icons"></div>
            <div class="banner-text" aria-hidden="true" v-html="props.block.text"></div>
         </div>
      </a>
   </div>
</template>

<script setup lang="ts">
   const firstIcons = ref<HTMLElement | null>(null);
   const secondIcons = ref<HTMLElement | null>(null);
   const offset = ref(0);
   const props = defineProps(['block']);

   let frameId = 0;
   let lastTimestamp = 0;
   let resetPoint = 0;
   const speed = 120;

   function wrapOffset() {
      if (offset.value <= -resetPoint) {
         offset.value += resetPoint;
      }
   }

   function measureResetPoint() {
      if (firstIcons.value === null || secondIcons.value === null) return;

      resetPoint = secondIcons.value.offsetLeft - firstIcons.value.offsetLeft;
      wrapOffset();
   }

   function animate(timestamp: number) {
      if (resetPoint === 0) {
         frameId = window.requestAnimationFrame(animate);
         return;
      }

      const delta = lastTimestamp === 0 ? 0 : timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      offset.value -= speed * (delta / 1000);

      wrapOffset();

      frameId = window.requestAnimationFrame(animate);
   }

   onMounted(() => {
      measureResetPoint();
      frameId = window.requestAnimationFrame(animate);
      window.addEventListener('resize', measureResetPoint);
   });

   onBeforeUnmount(() => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', measureResetPoint);
   });
</script>
