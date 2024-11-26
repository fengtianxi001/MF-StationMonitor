import { ref } from 'vue'

/**
 * @description: useloading
 * @param {*} defaultValue:默认加载状态
 * @param {*} delay:延迟关闭时间
 * @return {*}
 */
export function useLoading(defaultValue = false, delay = 0) {
  const loading = ref(defaultValue)
  const timer = ref(0)

  /** @description: 开启加载 */
  const openLoading = () => {
    loading.value = true
    timer.value = new Date().getTime()
  }

  /** @description: 关闭加载 */
  const closeLoading = () => {
    const now = new Date().getTime()
    const diff = now - timer.value
    if (diff < delay) {
      setTimeout(() => {
        loading.value = false
      }, delay - diff)
    } else {
      loading.value = false
    }
  }

  return {
    loading,
    openLoading,
    closeLoading,
  }
}
export default useLoading
