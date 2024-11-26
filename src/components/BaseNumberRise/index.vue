<template>
  <span class="base-number-rise">{{ tweened.number.toFixed(fixed) }}</span>
</template>
<script setup lang="ts">
import gsap from 'gsap'
import { reactive, watch } from 'vue'

interface PropsType {
  number: number | string
  fixed?: number
}

const props = withDefaults(defineProps<PropsType>(), {
  number: '--',
  fixed: 0,
})

const tweened = reactive({
  number: 0,
})

watch(
  () => props.number,
  (number) => {
    if (number === '--') return void 0
    gsap.to(tweened, { duration: 2, number: Number(number) || 0 })
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.base-number-rise {
  font-family: Number;
}
</style>
