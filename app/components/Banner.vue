<template>
   <div class="banner mb-1" :style="{backgroundColor: props.block.color}">
      <a :href="props.block.link" style="display: contents">
         <div class="banner-icons" v-html="props.block.icons"></div>
         <div class="banner-text" v-html="props.block.text"></div>
         <div class="banner-icons" v-html="props.block.icons"></div>
         <div class="banner-text" v-html="props.block.text"></div>
      </a>
   </div>
</template>

<script setup lang="ts">
   const props = defineProps(['block']);
</script>
