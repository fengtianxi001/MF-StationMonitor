import { onUnmounted, ref, watch } from 'vue'
import { isFunction, isNumber } from 'lodash'
import useDebounceFn from './useDebounceFn'
import useLoading from './useLoading'

export type OptionsType<T, U, Z> = {
  manual?: boolean
  debounceWait?: number
  loadingDelay?: number
  refreshDeps?: any[]
  defaultData: any
  defaultParams?: () => U
  pollingInterval?: number
  resultFormat: (res: T) => Z
  onBefore?: () => void | boolean
  onFinally?: (res?: Z) => void
}

/**
 * OptionsType 属性如下:
 * - `defaultData`(必填): 默认数据
 * - `resultFormat`(必填): 结果格式化
 * - `manual`(非必填): 是否手动执行, 默认为`false`
 * - `debounceWait`(非必填): 防抖时间, 默认为`0`
 * - `loadingDelay`(非必填): 加载延迟, 默认为`0`
 * - `refreshDeps`(非必填): 依赖刷新, 默认为`[]`
 * - `defaultParams`(非必填): 默认参数, 默认为`{}`
 * - `pollingInterval`(非必填): 轮询间隔, 默认为`0`
 * - `onBefore`(非必填): 请求前的钩子函数
 * - `onFinally`(非必填): 请求后的钩子函数
 */
export function useRequest<T, U, Z>(
  service: (params?: U) => Promise<T>,
  options: OptionsType<T, U, Z>
) {
  const { loading, openLoading, closeLoading } = useLoading(
    false,
    options?.loadingDelay ?? 0
  )
  const dataSource = ref<Z>(options.defaultData)
  const pollingCanceler = ref<Function | null>(null)
  const { run }: any = useDebounceFn(
    async () => {
      openLoading()
      // 请求前的钩子函数 返回false则不执行请求
      if (isFunction(options?.onBefore)) {
        const result = await options?.onBefore()
        if (result === false) return undefined
      }
      // 服务请求及参数处理
      const serviceParams = isFunction(options?.defaultParams)
        ? await options?.defaultParams()
        : {}
      service(serviceParams as any)
        .then(async (response) => {
          closeLoading()
          // @ts-ignore
          dataSource.value = await options.resultFormat(response)
          // 请求后的钩子函数
          if (isFunction(options?.onFinally)) {
            // @ts-ignore
            await options?.onFinally(dataSource.value)
          }
        })
        .catch(() => {
          closeLoading()
        })

      return undefined
    },
    { wait: options?.debounceWait ?? 0 }
  )
  // 是否手动执行
  options?.manual !== true && run()
  // 是否开启轮询
  if (isNumber(options?.pollingInterval)) {
    const timer = setInterval(() => run(), options?.pollingInterval)
    pollingCanceler.value = () => clearInterval(timer)
  }
  // 是否依赖刷新
  options?.refreshDeps && watch(options?.refreshDeps, run, { deep: true })
  onUnmounted(() => {
    pollingCanceler.value && pollingCanceler.value()
  })
  return {
    dataSource,
    loading,
    run,
    pollingCanceler,
    openLoading,
    closeLoading,
  }
}

export default useRequest
