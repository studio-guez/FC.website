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
			<div class="journal-header-filters small" v-if="route.query.tag">
				<span v-if="route.query.tag">Tag: {{ route.query.tag }} <NuxtLink :to="{path: '/journal', query: { author: route.query.author }}">✗</NuxtLink></span>
			</div>
			<ul class="tags tags--journal small" v-if="tags.length && !route.query.tag">
				<span class="tags-header">{{ tags.length > 1 ? "Tags" : "Tag" }}: </span>
				<li class="tag" v-for="tag in tags">
					<NuxtLink :to="{path: '/journal', query: { tag: tag }}">{{ tag }}</NuxtLink>
				</li>
			</ul>
		</header>
		<ul class="article-list">
			<NuxtLink :to="`/journal/articles#${article.slug}`" class="article-list-item" v-for="article in page?.children">
					<div class="article-list-item-header">
						<p class="small u">{{ article.published }}</p>
					</div>
					<div class="article-thumbnail">
						<img class="article-thumbnail-image" v-if="article.image_cover" :src="article.image_cover.url" :alt="article.image_cover.alt" :srcset="article.image_cover.srcset" sizes="20vw">
						<h2 class="article-thumbnail-title u" :style="{ '--title-length': article.title.length }">{{ article.title }}</h2>
					</div>
			</NuxtLink>
		</ul>
	</main>
</template>

<script setup>
	const route = useRoute();

	const { data, error } = await useFetch('/api/CMS_KQLRequest', {
		method: 'POST',
		key: `journal-data-${route.fullPath}`,
		body: computed(() => {
			let queryStr = "";

			if (route.query.tag) {
				queryStr += `.filterBy("tags", "*=", "${route.query.tag}")`;
			}

			return {
				query: 'site.find("journal")',
				select: {
					title: true,
					tags: 'page.children.filterBy("template", "article").sortBy("published", "desc").pluck("tags")',
					children: {
						query: 'page.children.filterBy("template", "article").sortBy("published", "desc")' + queryStr,
						select: {
							title: true,
							slug: true,
							image_cover: {
								query: 'page.image_cover.toFile',
								select: {
									url: true,
									alt: true,
									srcset: 'file.srcset([800, 1200, 1600, 2400])'	
								}
							},
							published: 'page.published.toDate("d.m.y")'
						}
					}
				}
			}
		})
	});

	const page = computed(() => data.value?.result);

	const tags = computed(() => [...new Set(page.value.tags.map(tags => tags.value.split(', ')).flat())].filter(str => str !== ""));

	console.log(tags.value);


</script>