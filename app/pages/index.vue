<template>
  <main>
    <h1>{{data?.result.page.title}}</h1>

    <template v-for="block of data?.result.page.htmlcontent">
      <div v-if="block.type === 'text'" :class="block.type"
           v-html="block.text"
      />
      <div v-if="block.type === 'image'" :class="[block.type, `image-corner-${block.cornerRadius}`]">
        <img :src="block.image.url" :alt="block.image.alt">
      </div>
    </template>

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
          "type": "text"
        },
        {
          "content": {
            "image": any
          },
          "id": string,
          "isHidden": boolean,
          "type": "image"
        }
      ]
    }
  }
}

const body = {
  query: 'site',
  select: {
    page: {
      query: 'site.find("home")',
      select: {
        title: true,
        slug: true,
        htmlcontent: {
          query: 'page.htmlcontent.toBlocks',
          select: {
            type: true,
            text: 'block.text.kirbytags',
            image: 'block.image.toFile',
            color: 'block.color',
            cornerRadius: 'block.cornerRadius'
          }
        },
      }
    }
  },
}

const {data, status} = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: JSON.stringify(body),
});

console.log(data);


// === [end] pour charger les data


</script>