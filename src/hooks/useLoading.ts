import { ref } from 'vue'

/**
 * useLoading
 * - defaultValue(非必填): 默认值, 默认为false
 * - delay(非必填): 延迟时间, 默认为0
 */
export function useLoading(defaultValue = false, delay = 0) {
  const loading = ref(defaultValue)
  const timer = ref(0)
  const openLoading = () => {
    loading.value = true
    timer.value = new Date().getTime()
  }
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
