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
         />
         <button
            v-if="!hasStarted"
            class="video-big-play video-control"
            type="button"
            @click="togglePlay"
            :aria-label="isPlaying ? 'Pause' : 'Play'"
         >
            <div class="video-icon" aria-hidden="true" v-html="playIcon"></div>
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
   const isFullscreen = ref(false);
   const seekPercent = ref(0);

   function togglePlay() {
      const el = videoEl.value;
      if (el.paused) {
         el.play();
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

   function onTimeUpdate() {
      const el = videoEl.value;
      seekPercent.value = (el.currentTime / el.duration) * 100;
   }

   function onSeek(event: Event) {
      const el = videoEl.value;
      const nextPercent = Number(event.target.value);
      el.currentTime = (nextPercent / 100) * videoEl.value.duration;
   }

   function toggleMute() {
      const el = videoEl.value;
      el.muted = !el.muted;
      muted.value = el.muted;
   }

   function toggleFullscreen() {
      if (document.fullscreenElement) {
         document.exitFullscreen();
      } else {
         containerEl.value.requestFullscreen();
      }
   }

   function onFullscreenChange() {
      isFullscreen.value = !!document.fullscreenElement;
   }

   onMounted(() => {
      document.addEventListener('fullscreenchange', onFullscreenChange);
   });

   onBeforeUnmount(() => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
   });
</script>
