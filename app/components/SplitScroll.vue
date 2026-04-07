<template>
    <div class="split-scroll mb-2" ref="el">
      <div class="split-scroll-col">
         <slot name="left"></slot>
      </div>
      <div class="split-scroll-col">
         <slot name="right"></slot>
      </div>
    </div>
</template>