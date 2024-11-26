<template>
  <div class="base-video" ref="container"></div>
</template>
<script setup lang="ts">
import {
  shallowRef,
  onMounted,
  ref,
  onUnmounted,
  watch,
  watchEffect,
} from 'vue'
import { videoToken } from '@/apis/video'
import { uniqueId } from 'lodash'
import { Message } from '@arco-design/web-vue'
import EZUIKit from 'ezuikit-js'

interface PropsType {
  video: string
  //   token: string
}
const props = defineProps<PropsType>()

const player = shallowRef()
const container = ref()
const id = `video-container-${uniqueId}`
const loading = ref(false)

const boostrap = (token: string) => {
  loading.value = true
  //如果存在实例则销毁
  // if (player.value) player.value?.destroy()
  if (!container.value) {
    loading.value = false
    return Message.error('视频容器未初始化')
  }
  container.value.id = id

  player.value = new EZUIKit.EZUIKitPlayer({
    id,
    accessToken: token,
    url: props.video,
    autoplay: true,
    template: 'standard',
  })
  loading.value = false
}
onMounted(async () => {
  const token: any = await videoToken()
  watch(
    () => props.video,
    () => {
      boostrap(token)
    },
    {
      immediate: true,
    }
  )
  // watchEffect(() => {
  //   if (!url.value) return void 0
  //   boostrap(token)
  // })
})
// onMounted(() => {
//   videoToken().then((accessToken) => {
//     watch(
//       () => props.video,
//       () => {
//         if (!props.video) return void 0
//         container.value.id = id
//         player.value = new EZUIKit.EZUIKitPlayer({
//           autoplay: true,
//           id,
//           accessToken,
//           url: props.video,
//           template: 'standard',
//         })
//         console.log('player.value', player.value.stop())
//       },
//       {
//         immediate: true,
//       }
//     )
//   })
// })
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
