<template>
  <main class="v-index"
  >
    <h1>index</h1>
    <div>status: {{status}}</div>
    <h2>liste des pages</h2>
    <div v-for="page of data?.result.children">
      {{page.title}}
      <NuxtLink :to="page.slug">lien</NuxtLink>
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
    children: {
      title: string,
      slug: string,
    }[]
  }
}

const slug = useRouter().currentRoute.value.params.slug

const body = {
    query: 'site',
    select: {
        children: {
            query: `site.children()`,
            select: {
                title: true,
                slug: true,
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
.v-index {
}
</style>
