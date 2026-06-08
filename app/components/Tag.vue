<template>
	<div class="tag x-small" :class="{'tag--bubble': props.shape == 'bubble', 'tag--star': props.shape == 'star'}" :style="borderStyle">
		<slot></slot>
	</div>
</template>

<script setup>
	import { ref, onMounted } from 'vue'

	const props = defineProps({
	  color: {
	    type: String,
	    default: '#27bc9c'
	  },
	  shape: {
	    type: String,
	    default: 'star'
	  }
	});

	const borderStyle = ref({})

	const generateBorderImage = () => {
	  const canvas = document.createElement('canvas')
	  const ctx = canvas.getContext('2d')
	  if (!ctx) return

	  if (props.shape === 'star') {
	    canvas.width = 256;
	    canvas.height = 256;
	    ctx.fillStyle = props.color;
	    ctx.scale(2, 2);
	    
	    const starPath = new Path2D("m127.458 62.267-9.581-12.703 1.946-15.792c.147-1.19-.629-2.534-1.733-3.002l-14.649-6.211L97.23 9.91c-.468-1.104-1.812-1.88-3.002-1.733l-15.792 1.946L65.733.541c-.957-.722-2.509-.722-3.466 0l-12.703 9.581-15.792-1.946c-1.19-.147-2.534.629-3.002 1.733l-6.211 14.649L9.91 30.769c-1.104.468-1.88 1.812-1.733 3.002l1.946 15.792L.541 62.267c-.722.957-.722 2.509 0 3.466l9.581 12.703-1.946 15.792c-.147 1.19.629 2.534 1.733 3.002l14.649 6.211 6.211 14.649c.468 1.104 1.812 1.88 3.002 1.733l15.792-1.946 12.703 9.581c.957.722 2.509.722 3.466 0l12.703-9.581 15.792 1.946c1.19.147 2.534-.629 3.002-1.733l6.211-14.649 14.649-6.211c1.104-.468 1.88-1.812 1.733-3.002l-1.946-15.792 9.581-12.703c.722-.957.722-2.509 0-3.466Z")
	    ctx.fill(starPath)

	    borderStyle.value = {
	      borderImageSource: `url(${canvas.toDataURL('image/png')})`
	    }

	  } else if (props.shape === 'bubble') {
	    canvas.width = 430;
	    canvas.height = 194;
	    ctx.fillStyle = props.color;
	    ctx.scale(2, 2);

	    const bubblePaths = [
	      "M69.477 59.312C50.398 85.32 23.224 101.5 8.783 95.452S-1.899 63.415 17.18 37.407 63.433-4.781 77.875 1.268s10.682 32.036-8.397 58.044Z",
	      "M112.378 59.312C93.299 85.32 66.125 101.5 51.684 95.452s-10.682-32.036 8.397-58.044c19.079-26.009 46.253-42.189 60.695-36.14s10.682 32.036-8.397 58.044Z",
	      "M154.763 59.312C135.684 85.32 108.51 101.5 94.069 95.452s-10.682-32.036 8.397-58.044c19.08-26.009 46.253-42.189 60.695-36.14s10.682 32.036-8.397 58.044Z",
	      "M197.407 59.312c-19.079 26.008-46.253 42.188-60.694 36.14s-10.682-32.036 8.397-58.044c19.079-26.009 46.253-42.189 60.694-36.14s10.682 32.036-8.397 58.044"
	    ]

	    bubblePaths.forEach(pathData => {
	      ctx.fill(new Path2D(pathData))
	    })

	    borderStyle.value = {
	      borderImageSource: `url(${canvas.toDataURL('image/png')})`
	    }
	  }
	}

	onMounted(() => {
		generateBorderImage()
	});
	
</script>