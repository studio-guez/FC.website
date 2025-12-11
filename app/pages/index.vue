<template>
	<Head>
    <Title>{{ data?.result.title }}</Title>
  </Head>
	<main class="site-main">
      <Section id="intro" />
      <SplitScroll>
         <template v-slot:left>
            <h3 class="mobile" style="color: rgb(111, 4, 206)">Les Expériences</h3>
            <Section id="experiences" />
         </template>
         <template v-slot:right>
            <h3 class="mobile" style="color: rgb(243, 96, 0);">Les Objets</h3>
            <Section id="objects" />
         </template>
      </SplitScroll>
      <SplitScroll>
         <template v-slot:left>
            <h3>Blabla à gauche</h3>
            <div>
               Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus!
            </div>
         </template>
         <template v-slot:right>
            <h3>Blabla à droite</h3>
            <div>
               Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus!
            </div>
            <h4>Sous-titre</h4>
            <div>
               Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus! Lorem ipsum dolor, sit amet consectetur adipisicing elit. Exercitationem enim tempora earum facere quo, adipisci inventore esse saepe mollitia tempore similique molestias animi optio. Sunt eos doloremque sint et voluptatibus!
            </div>
         </template>
      </SplitScroll>
      <Section id="outro" />
	</main>
</template>

<script setup lang="ts">
   // Query site content
   const body = {
      query: 'site',
      select: {
         title: true,
      }
   }

   const {data, status} = await useFetch('/api/CMS_KQLRequest', {
      lazy: true,
      method: 'POST',
      body: JSON.stringify(body),
   });

</script>