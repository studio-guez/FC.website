<template>
	<Head>
    <Title>{{ data?.result.title }}</Title>
  </Head>
	<main class="site-main">
		<Section id="intro" />
		<div class="split-scroll mb-2">
			<Section id="experiences" />
			<Section id="objects" />
		</div>
		<Section id="outro" />
	</main>
</template>

<script setup lang="ts">
   const body = {
      query: 'site',
      select: {
         title: true,
      }
   }

   const {data, status} = await useFetch('/api/CMS_KQLRequest', {
      lazy: true,
      method: 'POST',
      body: JSON.stringify(body),
   });

</script>