<template>
   <template v-for="block of props.blocks">
      <div v-if="block.type === 'text'" class="text" v-html="block.text" :style="{color: block.color}"/>
      <div v-if="block.type === 'image'" :class="['image', `image-corner-${block.cornerRadius}`]" :style="{color: block.color}">
         <img :src="block.image.url" :alt="block.image.alt">
      </div>
   </template>
</template>

<script setup lang="ts">
   const props = defineProps(['blocks']);
</script>