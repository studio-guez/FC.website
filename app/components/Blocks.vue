<template>
   <template v-for="block of props.blocks">

      <div v-if="block.type === 'text'" class="text mb-1" v-html="block.text" :style="{color: block.color}"/>

      <div v-if="block.type === 'image'" :class="['image', `image-corner-${block.cornerRadius}`, 'mb-1']" :style="{color: block.color}">
         <img :src="block.image.url" :alt="block.image.alt">
      </div>

      <div v-if="block.type === 'file'" class="file mb-1" :style="{color: block.color}">
         <a :href="block.file.url" target="_blank">{{ block.label }}</a>
      </div>

      <div v-if="block.type === 'link'" class="link mb-1" :style="{color: block.color}">
         <a :href="block.url" target="_blank">{{ block.label }}</a>
      </div>

      <hr v-if="block.type === 'hr'" class="hr mb-1" :style="{color: block.color}" />

      <div v-if="block.type === 'newsletter'" class="newsletter mb-1" :style="{color: block.color}">
         <Inscription/>
      </div>

   </template>
</template>

<script setup lang="ts">
   const props = defineProps(['blocks']);
</script>