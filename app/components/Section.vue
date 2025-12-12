<template>
   <section :id="props.id" class="section mb-2">
      <template v-for="block of props.blocks">
         <!-- Text -->
         <div v-if="block.type === 'text'" class="text mb-1" :class="{mobile: block.mobile}" v-html="block.text" :style="{color: block.color}"/>

         <!-- Image -->
         <div v-if="block.type === 'image'" :class="['image', 'mb-1']" :style="{color: block.color, borderRadius: `${block.cornerRadius*5}px`}">
            <img :src="block.image.url" :alt="block.image.alt">
         </div>

         <!-- File -->
         <div v-if="block.type === 'file'" class="file mb-1" :style="{color: block.color}">
            <a :href="block.file.url" target="_blank">{{ block.label }}</a>
         </div>

         <!-- Link -->
         <div v-if="block.type === 'link'" class="link mb-1" :style="{color: block.color}">
            <a :href="block.url" target="_blank">{{ block.label }}</a>
         </div>

         <!-- Subsections -->
          <section v-if="block.type === 'subsection'" class="subsection mb-1">
            <header v-html="block.title[0].text" :style="{color: block.title[0].color}" />
            <Section :id="block.content.id" :blocks="block.content"/>
          </section>

         <!-- Separator -->
         <hr v-if="block.type === 'hr'" class="hr mb-1" :style="{color: block.color}" />

         <!-- Newsletter -->
         <div v-if="block.type === 'newsletter'" class="newsletter mb-1" :style="{color: block.color}">
            <Newsletter/>
         </div>

      </template>
   </section>
</template>

<script setup lang="ts">
   const props = defineProps(['id', 'blocks']);

   console.log(props.blocks);
</script>