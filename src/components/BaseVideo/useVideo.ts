import EZUIKit from 'ezuikit-js'
import { shallowRef, onMounted, ref, onUnmounted, watchEffect } from 'vue'
import { videoToken } from '@/apis/video'
import { uniqueId } from 'lodash'
import { Message } from '@arco-design/web-vue'

export function useVideo(path: string) {
  const url = ref(path)
  const player = shallowRef()
  const container = ref()
  const id = `base-video-container${uniqueId}`
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
      url: url.value,
      autoplay: true,
      template: 'standard',
      width: '100%',
      height: '100%',
    })
    loading.value = false
  }
  onMounted(async () => {
    const token: any = await videoToken()
    watchEffect(() => {
      if (!url.value) return void 0
      boostrap(token)
    })
  })

  return {
    container,
    loading,
    player,
  }
}
