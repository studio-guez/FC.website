<template>
   <section :id="props.id" class="section mb-2">
      <Blocks :blocks="props.blocks" />
   </section>
</template>

<script setup lang="ts">
   const props = defineProps(['id', 'blocks']);
</script>