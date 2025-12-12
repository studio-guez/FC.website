<template>
	<Head>
    <Title>{{ data?.result?.title }}</Title>
  </Head>
	<main class="site-main">
      <template v-for="section in data?.result?.sections">
         <template v-if="section.columns.length == 1">
            <Section :id="section.columns[0].id" :blocks="section.columns[0].blocks"/>
         </template>
         
         <template v-if="section.columns.length == 2">
            <SplitScroll :color="section.attrs.color">
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
   // import { useRoute } from 'vue-router';
   import { useRoute, navigateTo } from '#app';
   
   const route = useRoute();
   const pathSegments = route.params.slug || [];
   const fullPageSlug = pathSegments.join('/');
   const pageQuery = pathSegments.length ? `site.find('${fullPageSlug}')` : 'site';
   const layoutQuery = pathSegments.length ? 'page.sections.toLayouts' : 'site.sections.toLayouts';

   const body = {
      query: pageQuery,
      select: {
         title: true,
         sections: {
            query: layoutQuery,
            select: {
               id: true,
               attrs: true,
               columns: {
                  select: {
                     id: true,
                     blocks: {
                        select: {
                           type: true,
                           color: true,
                           label: true,
                           url: true,
                           text: 'block.content.text.permalinksToUrls.absoluteToRelativeUrls.formatText',
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

   const { data, error } = await useFetch('/api/CMS_KQLRequest', {
      lazy: true,
      method: 'POST',
      body: JSON.stringify(body),
   });


   watchEffect(() => {
      // If the page doesn't exist, redirect to the parent page
      if (error.value || !data.value?.result) {
         const parentUrl = pathSegments.slice(0, -1).join('/') || '/';
         navigateTo(parentUrl, { redirectCode: 302 });
         return;
      }
   });

</script>