<template>
  <span>{{ number }}</span>
</template>
<script setup lang="ts">
import gsap from 'gsap'
import { watch, ref } from 'vue'
interface PropsType {
  value: number
}
const props = defineProps<PropsType>()

let progress: any
const number = ref(0)

watch(
  () => props.value,
  (newValue, oldValue) => {
    progress?.kill()
    progress = gsap.to(
      { number: oldValue ?? 0 },
      {
        duration: 2,
        number: Number(newValue) ?? 0,
        onUpdate: () => {
          const v = progress?.targets()[0].number || 0
          number.value = Math.round(v)
        },
        onComplete: () => {
          number.value = newValue
        },
      }
    )
  },
  {
    deep: true,
    immediate: true,
  }
)
// watchEffect(() => {
//   gsap.to(
//     { number: binding.oldValue ?? 0 },
//     {
//       duration: 2,
//       number: Number(binding.value) ?? 0,
//       onUpdate: () => onGaspUpdate(el),
//       onComplete: () => onGaspComplete(el),
//     }
//   )
// })
</script>
<!-- <style lang="scss" scoped></style> -->
