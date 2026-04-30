<template>
	<Head>
		<Title>{{ page?.title }}</Title>
		<Style>
	      :root {
	        --scrollbar-color: #ff6400;
	      }
    </Style>
	</Head>
	<main class="site-main journal">
		<header class="journal-header">
			<h1 class="h3 u journal-header-title"><NuxtLink to="/journal">{{ page?.title }}</NuxtLink></h1>
		</header>
		<ul class="article-list">
			<NuxtLink :to="`/journal/articles#${article.slug}`" class="article-list-item" v-for="article in page?.children">
					<div class="article-list-item-header">
						<p class="small u">{{ article.published }}</p>
					</div>
					<div class="article-thumbnail">
						<img class="article-thumbnail-image" v-if="article.image_cover" :src="article.image_cover.url" :alt="article.image_cover.alt">
						<h2 class="article-thumbnail-title u" :style="{ '--title-length': article.title.length }">{{ article.title }}</h2>
					</div>
			</NuxtLink>
		</ul>
	</main>
</template>

<script setup>

	const { data, error } = await useFetch('/api/CMS_KQLRequest', {
		method: 'POST',
		body: {
			query: 'site.find("journal")',
			select: {
				title: true,
				children: {
					query: 'page.children.filterBy("template", "article")',
					select: {
						title: true,
						slug: true,
						image_cover: 'page.image_cover.toFile',
						published: 'page.published.toDate("d.m.y")'
					}
				}
			}
		}
	});

	const page = computed(() => data.value?.result);

	console.log(page.value);

</script>