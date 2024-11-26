import { catchAsync } from '@/plugins/utils'
import { get, isFunction } from 'lodash'
import { ref } from 'vue'

type UseSelectOptionsParamsType = {
  service: any
  config?: {
    label: string
    value: string
  }
  callback?: (res: any) => any
}

/**
 * UseSelectOptionsParamsType 属性如下:
 * - `service`(必填): 请求的接口函数
 * - `config`(非必填): 默认为`{ 'label', 'value' }`
 * - `callback`(非必填): 格式化数据的回调函数,用于解决`config`无法处理的情况，会将执行结果赋值给`options`
 */
export function useSelectOptions(params: UseSelectOptionsParamsType) {
  const {
    service,
    config = { label: 'label', value: 'value' },
    callback,
  } = params
  const options = ref<any[]>([])
  const run = async () => {
    const { success, data } = await catchAsync(service())
    if (!success) return void 0
    if (callback && isFunction(callback)) options.value = callback(data)
    options.value = data.map((item: any) => {
      return {
        label: get(item, config.label),
        value: get(item, config.value),
      }
    })
  }
  run()
  return options
}

export default useSelectOptions
