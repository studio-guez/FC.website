<template>
   <section :id="props.id">
      <div v-for="section of data?.result.sections">
         <Blocks :blocks="section.blocks" />
      </div>
   </section>
</template>

<script setup lang="ts">
   const props = defineProps(['id']);

   const body = {
      query: 'site',
      select: {
         sections: {
            query: `site.${props.id}_layout.toLayouts`,
            select: {
               attrs: true,
               blocks: {
                  query: 'layout.columns.first.blocks',
                  select: {
                     type: true,
                     color: true,
                     text: 'block.text.kirbytags',
                     image: 'block.image.toFile',
                     cornerRadius: 'block.cornerRadius'
                  }
               }
            }
         }
      }
   }

   const {data, status} = await useFetch('/api/CMS_KQLRequest', {
      lazy: true,
      method: 'POST',
      body: JSON.stringify(body),
   });
</script>