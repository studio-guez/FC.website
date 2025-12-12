<template>
	<Head>
    <Title>{{ data?.result.title }}</Title>
  </Head>
	<main class="site-main">
      <template v-for="section in data?.result.sections">
         <template v-if="section.columns.length == 1">
            <Section :id="section.columns[0].id" :blocks="section.columns[0].blocks"/>
         </template>
         
         <template v-if="section.columns.length == 2">
            <SplitScroll>
               <template v-slot:left>
                  <Section :id="section.columns[0].id" :blocks="section.columns[0].blocks"/>
               </template>
               <template v-slot:right>
                  <Section :id="section.columns[1].id" :blocks="section.columns[1].blocks"/>
               </template>
            </SplitScroll>
         </template>
      </template>
	</main>
</template>

<script setup lang="ts">
   // Query site content
   const body = {
      query: 'site',
      select: {
         title: true,
         sections: {
            query: 'site.sections.toLayouts',
            select: {
               id: true,
               columns: {
                  select: {
                     id: true,
                     blocks: {
                        select: {
                           type: true,
                           color: true,
                           label: true,
                           url: true,
                           text: 'block.content.text.kirbytags',
                           image: 'block.content.image.toFile',
                           file: 'block.content.file.toFile',
                           cornerRadius: 'block.content.cornerRadius'
                        }
                     }
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