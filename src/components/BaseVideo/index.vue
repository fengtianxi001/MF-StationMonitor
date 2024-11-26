<template>
  <div class="base-video" ref="container"></div>
</template>
<script setup lang="ts">
import { onMounted, shallowRef, ref } from 'vue'
import EZUIKit from 'ezuikit-js'
import { uniqueId } from 'lodash'
import { watch } from 'vue'
import { videoToken } from '@/apis/video'
interface PropsType {
  video: string
  //   token: string
}
const props = defineProps<PropsType>()
const player = shallowRef()
const id = `container-${uniqueId()}`
const container = ref()
onMounted(() => {
  videoToken().then((accessToken) => {
    watch(
      () => props.video,
      () => {
        console.log('props.video', props.video)
        if (!props.video) return void 0
        container.value.id = id
        player.value = new EZUIKit.EZUIKitPlayer({
          autoplay: true,
          id,
          accessToken,
          url: props.video,
          template: 'standard',
        })
      },
      {
        immediate: true,
      }
    )
  })
})
</script>
<style lang="scss">
.base-video {
  width: 100%;
  height: 100%;
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
