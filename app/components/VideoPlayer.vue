<template>
   <div ref="containerEl" class="video-player" :class="{ 'is-started': hasStarted }" :style="{ color }">
      <div class="video-stage">
         <video
            ref="videoEl"
            class="video-media"
            :src="src"
            :poster="poster"
            playsinline
            @click="togglePlay"
            @dblclick="toggleFullscreen"
            @play="onPlay"
            @pause="onPause"
            @timeupdate="onTimeUpdate"
            @loadedmetadata="onLoadedMetadata"
         />
         <button
            v-if="!hasStarted"
            class="video-big-play video-control"
            type="button"
            @click="togglePlay"
            :aria-label="isPlaying ? 'Pause' : 'Play'"
         >
            <span class="video-icon" aria-hidden="true" v-html="playIcon"></span>
         </button>
      </div>

      <div class="video-controls">
         <button class="video-control" type="button" @click="togglePlay" :aria-label="isPlaying ? 'Pause' : 'Play'">
            <span class="video-icon" aria-hidden="true" v-html="isPlaying ? pauseIcon : playIcon"></span>
         </button>

         <input
            class="video-progress"
            type="range"
            min="0"
            max="100"
            step="0.1"
            v-model="seekPercent"
            @change="onSeek"
            :aria-label="'Progress'"
         >

         <button class="video-control" type="button" @click="toggleMute" :aria-label="muted ? 'Unmute' : 'Mute'">
            <span class="video-icon" aria-hidden="true" v-html="muted ? unmuteIcon : muteIcon"></span>
         </button>

         <button class="video-control" type="button" @click="toggleFullscreen" :aria-label="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'">
            <span class="video-icon" aria-hidden="true" v-html="isFullscreen ? exitFullscreenIcon : fullscreenIcon"></span>
         </button>
      </div>
   </div>
</template>

<script setup lang="ts">
   import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
   import playIcon from '~/assets/svg/icon-play.svg?raw';
   import pauseIcon from '~/assets/svg/icon-pause.svg?raw';
   import muteIcon from '~/assets/svg/icon-mute.svg?raw';
   import unmuteIcon from '~/assets/svg/icon-unmute.svg?raw';
   import fullscreenIcon from '~/assets/svg/icon-fullscreen.svg?raw';
   import exitFullscreenIcon from '~/assets/svg/icon-fullscreen-exit.svg?raw';

   const props = defineProps<{
      src: string;
      poster?: string;
      color?: string;
   }>();

   const videoEl = ref<HTMLVideoElement | null>(null);
   const containerEl = ref<HTMLElement | null>(null);

   const isPlaying = ref(false);
   const hasStarted = ref(false);
   const muted = ref(false);
   const duration = ref(0);
   const currentTime = ref(0);
   const isFullscreen = ref(false);

   const progressPercent = computed(() => {
      if (!duration.value) return 0;
      return (currentTime.value / duration.value) * 100;
   });

   const seekPercent = ref(0);

   function togglePlay() {
      const el = videoEl.value;
      if (!el) return;
      if (el.paused) {
         const playPromise = el.play();
         if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
         }
      } else {
         el.pause();
      }
   }

   function onPlay() {
      isPlaying.value = true;
      hasStarted.value = true;
   }

   function onPause() {
      isPlaying.value = false;
   }

   function onLoadedMetadata() {
      const el = videoEl.value;
      if (!el) return;
      duration.value = el.duration || 0;
   }

   function onTimeUpdate() {
      const el = videoEl.value;
      if (!el) return;
      currentTime.value = el.currentTime || 0;
      seekPercent.value = progressPercent.value;
   }

   function onSeek(event: Event) {
      const el = videoEl.value;
      if (!el || !duration.value) return;
      const target = event.target as HTMLInputElement;
      const nextPercent = Number(target.value) || 0;
      el.currentTime = (nextPercent / 100) * duration.value;
   }

   function toggleMute() {
      const el = videoEl.value;
      if (!el) return;
      el.muted = !el.muted;
      muted.value = el.muted;
   }

   function toggleFullscreen() {
      const el = containerEl.value;
      if (!el) return;
      if (document.fullscreenElement) {
         document.exitFullscreen();
      } else {
         el.requestFullscreen();
      }
   }

   function onFullscreenChange() {
      isFullscreen.value = !!document.fullscreenElement;
   }

   onMounted(() => {
      document.addEventListener('fullscreenchange', onFullscreenChange);

      if (videoEl.value.readyState >= 2) {
         onLoadedMetadata();
      }
   });

   onBeforeUnmount(() => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
   });
</script>
