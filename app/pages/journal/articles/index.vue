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
		<ul class="articles">
			<li class="article" :id="article.slug" v-for="article in page?.children">
				<header class="article-thumbnail">
					<h2 class="article-thumbnail-title u" :style="{ '--title-length': article.title.length }">{{ article.title }}</h2>
				</header>
				<div class="article-content">
					<template v-for="block in article.content">
						<div class="text" v-if="block.text" v-html="block.text"></div>
						<figure v-if="block.image">
							<img :src="block.image.url" :alt="block.image.alt">
							<figcaption class="small" v-if="block.caption">{{ block.caption }}</figcaption>
						</figure>
					</template>
				</div>
				<div class="article-cover" v-if="article.image_cover">
					<img :src="article.image_cover.url" :alt="article.image_cover.alt">
				</div>
			</li>
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
						published: 'page.published.toDate("d.m.y")',
						content: {
							query: 'page.text.toBlocks',
							select: {
								text: 'block.content.text',
								image: 'block.content.image.toFile',
								caption: 'block.content.caption'
							}
						}
					}
				}
			}
		}
	});

	const page = computed(() => data.value?.result);

	console.log(page.value);

</script>