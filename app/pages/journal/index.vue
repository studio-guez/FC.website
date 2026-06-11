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
			<h1 class="h3 u journal-header-title"><NuxtLink to="/journal">{{ page.title }}</NuxtLink></h1>
			<Tag class="journal-header-description" shape="star" color="#f6d2e8">
				<div v-html="page.description"></div>
			</Tag>
			<div class="journal-header-tags">
				<nav aria-label="Filtrer par catégories" class="tags">
					<template v-for="category in page.categories">
						 <Tag v-if="tagIsActive(category, 'category')" :color="category.color" shape="star">
							<NuxtLink :to="{path: '/journal', query: route.query.category ? { theme: route.query.theme } : { category: category.slug, theme: route.query.theme }}">
								{{ category.title }}
								<span v-if="route.query.category && tagIsActive(category, 'category')"> ✗</span>
							</NuxtLink>
						</Tag>
					</template>
				</nav>
				<nav aria-label="Filtrer par thématiques" class="tags">
					<template v-for="theme in page.themes">
						 <Tag v-if="tagIsActive(theme, 'theme')" :color="theme.color" shape="bubble">
							<NuxtLink :to="{path: '/journal', query: route.query.theme ? { category: route.query.category } : { theme: theme.slug, category: route.query.category }}">
								{{ theme.title }}
								<span v-if="route.query.theme && tagIsActive(theme, 'theme')"> ✗</span>
							</NuxtLink>
						</Tag>
					</template>
				</nav>
			</div>
		</header>
		<ul class="article-list">
			<li class="container">
				<NuxtLink :to="`/journal/articles#${article.slug}`" class="article-list-item" v-for="article in page.children">
						<div class="article-list-item-header">
							<p class="small u">{{ article.published }}</p>
						</div>
						<div class="article-thumbnail">
							<img class="article-thumbnail-image" v-if="article.image_cover" :src="article.image_cover.url" :alt="article.image_cover.alt" :srcset="article.image_cover.srcset" sizes="20vw">
							<h2 class="article-thumbnail-title u" :style="{ '--title-length': article.title.length }">{{ article.title }}</h2>
						</div>
				</NuxtLink>
			</li>
		</ul>
	</main>
</template>

<script setup>
	const route = useRoute();

	const fetchKey = computed(() => {
		return `journal-${route.fullPath.replace(route.hash, '')}`;
	});

	const { data, error } = await useFetch('/api/CMS_KQLRequest', {
		method: 'POST',
		key: fetchKey.value,
		body: computed(() => {
			let queryStr = "";

			if (route.query.category) {
				queryStr += `.filterBy("categories", "*=", "${route.query.category}")`;
			}

			if (route.query.theme) {
				queryStr += `.filterBy("themes", "*=", "${route.query.theme}")`;
			}

			return {
				query: 'site.find("journal")',
				select: {
					title: true,
					description: 'page.description.permalinksToUrls.absoluteToRelativeUrls.formatText',
					categories: {
						query: 'page.find("tags").children.template("tag-category")',
						select: {
							title: true,
							slug: true,
							color: true
						}
					},
					themes: {
						query: 'page.find("tags").children.template("tag-theme")',
						select: {
							title: true,
							slug: true,
							color: true
						}
					},
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

	function tagIsActive(tag, param) {
		const isSelected = route.query[param] == tag.slug;
		const hasSelection = route.query[param];

		return !hasSelection || isSelected; 
	}


</script>