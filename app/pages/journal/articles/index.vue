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
			<div class="journal-header-filters small">
				<span v-if="route.query.author">Auteur·ice: {{ page.filters.author.username }} <NuxtLink :to="{path: '/journal/articles', query: { tag: route.query.tag }}">✗</NuxtLink></span>
				<span v-if="route.query.tag">Tag: {{ route.query.tag }} <NuxtLink :to="{path: '/journal/articles', query: { author: route.query.author }}">✗</NuxtLink></span>
			</div>
		</header>
		<ul class="articles" v-if="!pending">
			<li class="article" :id="article.slug" v-for="article in page?.children">
				<header class="article-header">
					<div class="article-thumbnail">
						<h2 class="article-thumbnail-title u" :style="{ '--title-length': article.title.length }">{{ article.title }}</h2>
					</div>
					<div class="article-meta small">
						<span>{{ article.published }}</span>
						<span class="spacer"></span>
						<NuxtLink :to="{ path: '/journal/articles', query: { author: article.author?.id, tag: route.query.tag }}" class="inline-block">
							{{ article.author?.username }}
						</NuxtLink>
					</div>
					<ul class="tags tags--article small" v-if="article.tags.length">
						<p class="tags-header">{{ article.tags.length > 1 ? "Tags" : "Tag" }}:</p>
						<li class="tag" v-for="tag in article.tags">
							<NuxtLink :to="{path: '/journal/articles', query: { tag: tag, author: route.query.author }}">{{ tag }}</NuxtLink>
						</li>
					</ul>
				</header>
				<div class="article-content">
					<template v-for="block in article.content">
						<div class="text" v-if="block.text" v-html="block.text"></div>
						<figure v-if="block.image">
							<img :src="block.image.url" :alt="block.image.alt" :srcset="block.image.srcset" sizes="40vw">
							<figcaption class="small" v-if="block.caption">{{ block.caption }}</figcaption>
						</figure>
					</template>
				</div>
				<div class="article-cover" v-if="article.image_cover">
					<img :src="article.image_cover.url" :alt="article.image_cover.alt" :srcset="article.image_cover.srcset" sizes="40vw">
				</div>
			</li>
		</ul>
	</main>
</template>

<script setup>
	const route = useRoute();

	const { data, error, pending } = await useFetch('/api/CMS_KQLRequest', {
		method: 'POST',
		key: `journal-data-${route.fullPath}`,
		body: computed(() => {
			let queryStr = "";

			if (route.query.author) {
				queryStr += `.filterBy("author", "*=", "${route.query.author}")`;
			}

			if (route.query.tag) {
				queryStr += `.filterBy("tags", "*=", "${route.query.tag}")`;
			}

			return {
				query: 'site',
				select: {
					title: 'site.find("journal").title',
					filters: {
						query: 'kirby',
						select: {
							author: `kirby.users.find("${route.query.author}")`	
						}
					},
					children: {
						query: 'site.find("journal").children.filterBy("template", "article").sortBy("published", "desc")' + queryStr,
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
							published: 'page.published.toDate("d.m.y")',
							author: 'page.author.toUser',
							tags: 'page.tags.split(",")',
							content: {
								query: 'page.text.toBlocks',
								select: {
									text: 'block.content.text',
									image: {
										query: 'block.content.image.toFile',
										select: {
											url: true,
											alt: true,
											srcset: 'file.srcset([800, 1200, 1600, 2400])'	
										}
									},
									caption: 'block.content.caption'
								}
							}
						}
					}
				}
			}
		})
	});

	watch(pending, (isPending) => {
		if (!isPending) {
			window.scrollTo({ top: 0, behavior: 'instant' });
		}
	});

	const page = computed(() => data.value?.result);
	console.log(page.value);

</script>