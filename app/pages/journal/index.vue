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
			<nav aria-label="Filtrer par catégories" class="tags tags--journal">
				<template v-for="category in page.categories">
					 <div class="tag tag--star small" v-if="tagIsActive(category, 'category')" :style="TagStar(category.color)">
						<NuxtLink :to="{path: '/journal', query: route.query.category ? { theme: route.query.theme } : { category: category.slug, theme: route.query.theme }}">
							{{ category.title }}
							<span v-if="route.query.category && tagIsActive(category, 'category')"> ✗</span>
						</NuxtLink>
					</div>
				</template>
			</nav>
			<nav aria-label="Filtrer par thématiques" class="tags tags--journal">
				<template v-for="theme in page.themes">
					 <div class="tag tag--bubble small" v-if="tagIsActive(theme, 'theme')" :style="TagBubble(theme.color)">
						<NuxtLink :to="{path: '/journal', query: route.query.theme ? { category: route.query.category } : { theme: theme.slug, category: route.query.category }}">
							{{ theme.title }}
							<span v-if="route.query.theme && tagIsActive(theme, 'theme')"> ✗</span>
						</NuxtLink>
					</div>
				</template>
			</nav>
		</header>
		<ul class="article-list">
			<li class="container">
				<NuxtLink :to="`/journal/articles#${article.slug}`" class="article-list-item" v-for="article in page?.children">
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

	const { data, error } = await useFetch('/api/CMS_KQLRequest', {
		method: 'POST',
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

	function TagStar(color='black') {
		return { 
			borderImageSource: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='${color.replace('#', '%23')}' width='128' height='128'%3E%3Cpath d='m127.458 62.267-9.581-12.703 1.946-15.792c.147-1.19-.629-2.534-1.733-3.002l-14.649-6.211L97.23 9.91c-.468-1.104-1.812-1.88-3.002-1.733l-15.792 1.946L65.733.541c-.957-.722-2.509-.722-3.466 0l-12.703 9.581-15.792-1.946c-1.19-.147-2.534.629-3.002 1.733l-6.211 14.649L9.91 30.769c-1.104.468-1.88 1.812-1.733 3.002l1.946 15.792L.541 62.267c-.722.957-.722 2.509 0 3.466l9.581 12.703-1.946 15.792c-.147 1.19.629 2.534 1.733 3.002l14.649 6.211 6.211 14.649c.468 1.104 1.812 1.88 3.002 1.733l15.792-1.946 12.703 9.581c.957.722 2.509.722 3.466 0l12.703-9.581 15.792 1.946c1.19.147 2.534-.629 3.002-1.733l6.211-14.649 14.649-6.211c1.104-.468 1.88-1.812 1.733-3.002l-1.946-15.792 9.581-12.703c.722-.957.722-2.509 0-3.466Z'/%3E%3C/svg%3E")` 
		};
	}

	function TagBubble(color='black') {
		return { 
			borderImageSource: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='${color.replace('#', '%23')}' viewBox='0 0 214.587 96.719' width='214.587' height='96.719'%3E%3Cpath d='M69.477 59.312C50.398 85.32 23.224 101.5 8.783 95.452S-1.899 63.415 17.18 37.407 63.433-4.781 77.875 1.268s10.682 32.036-8.397 58.044Z'/%3E%3Cpath d='M112.378 59.312C93.299 85.32 66.125 101.5 51.684 95.452s-10.682-32.036 8.397-58.044c19.079-26.009 46.253-42.189 60.695-36.14s10.682 32.036-8.397 58.044Z'/%3E%3Cpath d='M154.763 59.312C135.684 85.32 108.51 101.5 94.069 95.452s-10.682-32.036 8.397-58.044c19.08-26.009 46.253-42.189 60.695-36.14s10.682 32.036-8.397 58.044Z'/%3E%3Cpath d='M197.407 59.312c-19.079 26.008-46.253 42.188-60.694 36.14s-10.682-32.036 8.397-58.044c19.079-26.009 46.253-42.189 60.694-36.14s10.682 32.036-8.397 58.044'/%3E%3C/svg%3E")` 
		};
	}


</script>