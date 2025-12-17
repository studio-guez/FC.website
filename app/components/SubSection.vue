<template>
   <div class="accordion" ref="el" :style="{color: props.header.color}">
      <header class="accordion-trigger">
         <div v-html="props.header.text" />
      </header>
      <div class="accordion-panel">
         <Section :blocks="props.blocks"/>
      </div>
   </div>
</template>

<script setup lang="ts">
   const props = defineProps(['header', 'blocks']);
   const el = useTemplateRef('el');
   
   onMounted(() => {
         const duration = 350;
         const easing = 'cubic-bezier(0.5, 0, 0.5, 1)';
         const trigger = el.value.querySelector('.accordion-trigger');
         const content = el.value.querySelector('.accordion-panel');
         let animation = null;
         let isClosing = false;
         let isExpanding = false;

         content.style.maxHeight = "0px";
      const mediaQuery = window.matchMedia("(max-width: 920px)");

      if (content === null || trigger === null) return;

      function toggleAccordion() {
         if (mediaQuery.matches) {
            initAccordion();
         } else {
            destroyAccordion();
         }
      }

      toggleAccordion();

      mediaQuery.addListener(toggleAccordion);

      function initAccordion() {
         trigger.addEventListener('click', onClick);
         onAnimationFinish(false);
      }

      function destroyAccordion() {
         trigger.removeEventListener('click', onClick);
         onAnimationFinish(true);
      }

      function onClick(e) {
         e.preventDefault();
         content.style.overflow = 'hidden';

         if (isClosing || !content.open) {
            open();
         } else if (isExpanding || content.open) {
            shrink();
         }
      }

      function shrink() {
         isClosing = true;
         
         const startHeight = `${content.offsetHeight}px`;
         const endHeight = '0px';
         
         if (animation) animation.cancel();
         
         animation = content.animate({		
            height: [startHeight, endHeight]
         }, {
            duration: duration,
            easing: easing
         });
         
         animation.onfinish = () => onAnimationFinish(false);
         animation.oncancel = () => isClosing = false;
      }

      function open() {
         content.style.maxHeight = '';
         content.open = true;
         content.classList.add('open');
         window.requestAnimationFrame(() => expand());
      }

      function expand() {
         isExpanding = true;
         const startHeight = "0px";
         const endHeight = `${content.offsetHeight}px`;
         
         if (animation) animation.cancel();

         animation = content.animate({		
            maxHeight: [startHeight, endHeight]
         }, {
            duration: duration,
            easing: easing
         });
         animation.onfinish = () => onAnimationFinish(true);
         animation.oncancel = () => isExpanding = false;
      }

      function onAnimationFinish(open) {
         content.open = open;
         animation = null;
         isClosing = false;
         isExpanding = false;
         trigger.ariaExpanded = open;
         content.style.maxHeight = open ? '' : '0px';
         content.style.overflow = open ? '' : 'hidden';
         if (!open) content.classList.remove('open');
      }
   });
</script>