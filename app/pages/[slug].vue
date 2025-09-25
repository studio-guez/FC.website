<template>
  <main class="v-slug"
  >
    <h1>{{data?.result.page.title}}</h1>
    <div>status: {{status}}</div>

    <template v-for="block of data?.result.page.htmlcontent">
      <iframe v-if="block.type === 'video'"
              class="v-slug__video"
              :src="block.content.url"
      />
      <div v-else-if="block.type === 'textWithTitle'"
           v-html="block.content.text"
      />
    </template>

    <div>
      <NuxtLink to="/">< index</NuxtLink>
    </div>

  </main>
</template>


<script setup lang="ts">

// === [start] pour charger les data

//
/**
 * Represents the data fetched from the CMS API, extending the base CMS_API_Response structure.
 *
 * This type is used to model the response structure when fetching hierarchical content
 * data from the CMS API.
 */
type FetchData = CMS_API_Response & {
  result: {
    page: {
      title: string,
      slug: string,
      htmlcontent: [
        {
          "content": {
            "text": string
          },
          "id": string,
          "isHidden": boolean,
          "type": "textWithTitle"
        },
        {
          "content": {
            "url": string
          },
          "id": string,
          "isHidden": boolean,
          "type": "video"
        }],
    }
  }
}

const slug = useRouter().currentRoute.value.params.slug

const body = {
  query: 'site',
  select: {
    page: {
      query: `site.find('${slug}')`,
      select: {
        title: true,
        slug: true,
        htmlcontent: `page.htmlcontent.toBlocks`,
      }
    }
  },
}

const {data, status} = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: JSON.stringify(body),
})


// === [end] pour charger les data


</script>


<style lang="scss" scoped>
.v-slug {
}
</style>
