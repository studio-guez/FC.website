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
			<div class="article-meta author small" v-if="page?.filters.author">
					<span>Auteur·ice: </span>
					<span class="spacer"></span>
					<NuxtLink :to="{path: '/journal/articles', query: { ...route.query, author: undefined }}">{{ page?.filters.author.username }}  ✗</NuxtLink>
				</div>
			<div class="filters">
				<div class="tags" >
					<Tag v-if="activeCategory" shape="star" :color="activeCategory.color"><NuxtLink :to="{path: '/journal/articles', query: { ...route.query, category: undefined }}">{{ activeCategory.title }} ✗</NuxtLink>
					</Tag>
					<Tag v-if="activeTheme"shape="bubble" :color="activeTheme.color"><NuxtLink :to="{path: '/journal/articles', query: { ...route.query, theme: undefined }}">{{ activeTheme.title }} ✗</NuxtLink>
					</Tag>
				</div>
			</div>
		</header>
		<ul class="articles" v-if="!pending">
			<li class="article" :id="article.slug" v-for="article in page?.children">
				<article class="container">
					<header class="article-header">
						<div class="article-thumbnail">
							<h2 class="article-thumbnail-title u" :style="{ '--title-length': article.title.length }">{{ article.title }}</h2>
						</div>
						<div>
							<div class="article-meta small">
								<span>{{ article.published }}</span>
								<span class="spacer"></span>
								<NuxtLink :to="{ path: '/journal/articles', query: {...route.query, author: article.author?.id }}" class="inline-block">
									{{ article.author?.username }}
								</NuxtLink>
							</div>
							<ul class="tags tags--article">
								<li v-for="category in article.categories">
									<Tag shape="star" :color="category.color">
										<NuxtLink :to="{path: '/journal/articles', query: { ...route.query, category: category.slug }}">{{ category.title }}</NuxtLink>
									</Tag>
								</li>
							</ul>
							<ul class="tags tags--article">
								<li v-for="theme in article.themes">
									<Tag shape="bubble" :color="theme.color">
										<NuxtLink :to="{path: '/journal/articles', query: { ...route.query, theme: theme.slug }}">{{ theme.title }}</NuxtLink>
									</Tag>
								</li>
							</ul>
						</div>
					</header>
					<div class="article-main">
						<div class="article-content">
							<template v-for="block in article.content">
								<div class="text" v-if="block.text" v-html="block.text"></div>
								<figure v-if="block.image">
									<img :src="block.image.url" :alt="block.image.alt" :srcset="block.image.srcset" sizes="40vw">
									<figcaption class="small" v-if="block.caption">{{ block.caption }}</figcaption>
								</figure>
								<figure v-if="block.video" class="video" :class="{mobile: block.mobile}" :style="{color: block.color}">
				            	<VideoPlayer :src="block.video?.url" :poster="block.video?.poster?.url" :color="block.color" />
				            	<figcaption v-if="block.caption" class="small">{{ block.caption }}</figcaption>
				         	</figure>
							</template>
						</div>
						<div class="article-cover" v-if="article.image_cover">
							<img :src="article.image_cover.url" :alt="article.image_cover.alt" :srcset="article.image_cover.srcset" sizes="40vw">
						</div>
					</div>
				</article>
			</li>
		</ul>
	</main>
</template>

<script setup>
	const route = useRoute();
	const isPreview = computed(() => route.query.preview === '1');

	const fetchKey = computed(() => {
		return `journal-${route.fullPath.replace(route.hash, '')}`;
	});

	const { data, error, pending } = await useFetch('/api/CMS_KQLRequest', {
		method: 'POST',
		key: fetchKey.value,
		body: computed(() => {
			let queryStr = "";
			const childrenMethod = isPreview.value ? 'childrenAndDrafts' : 'children';

			if (route.query.author) {
				queryStr += `.filterBy("author", "*=", "${route.query.author}")`;
			}

			if (route.query.category) {
				queryStr += `.filterBy("categories", "*=", "${route.query.category}")`;
			}

			if (route.query.theme) {
				queryStr += `.filterBy("themes", "*=", "${route.query.theme}")`;
			}

			return {
				_version: route.query._version,
				query: 'site',
				select: {
					title: 'site.find("journal").title',
					filters: {
						query: 'kirby',
						select: {
							author: `kirby.users.find("${route.query.author}")`,
							categories: {
								query: 'site.find("journal/tags").children.template("tag-category")',
								select: {
									title: true,
									slug: true,
									color: true
								}
							},
							themes: {
								query: 'site.find("journal/tags").children.template("tag-theme")',
								select: {
									title: true,
									slug: true,
									color: true
								}
							},	
						}
					},
					children: {
						query: `site.find("journal").${childrenMethod}.filterBy("template", "article").sortBy("published", "desc")` + queryStr,
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
							categories: {
								query: 'page.categories.toPages(",")',
								select: {
									title: true,
									slug: true,
									color: true
								}
							},
							themes: {
								query: 'page.themes.toPages(",")',
								select: {
									title: true,
									slug: true,
									color: true
								}
							},
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
									video: 'block.content.video.toFile',
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
		if (isPending) {
			window.scrollTo({ top: 0, behavior: 'instant' });
		}
	});

	const page = computed(() => data.value?.result);

	const activeCategory = computed(() => {
		return page.value?.filters.categories.find(cat => cat.slug == route.query.category);
	});

	const activeTheme = computed(() => {
		return page.value?.filters.themes.find(cat => cat.slug == route.query.theme);
	});

</script>
