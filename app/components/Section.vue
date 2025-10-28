<template>
   <section :id="props.id" class="section mb-2">
      <Blocks :blocks="data?.result" />
   </section>
</template>

<script setup lang="ts">
   const props = defineProps(['id']);

   const body = {
      query: `site.${props.id}_layout.toBlocks`,
      select: {
         type: true,
         color: true,
         label: true,
         url: true,
         text: 'block.text.kirbytags',
         image: 'block.image.toFile',
         file: 'block.file.toFile',
         cornerRadius: 'block.cornerRadius'
      }
   }

   let {data} = await useFetch('/api/CMS_KQLRequest', {
      lazy: true,
      method: 'POST',
      body: JSON.stringify(body),
   });
</script>