import { isFunction } from 'lodash'
import { ref, watch, type WatchStopHandle } from 'vue'
import { useCatchAsync } from '../hooks/useCatchAsync'
import { useLoading } from './useLoading'

interface OptionsType {
  defaultValue?: any
  formmatter?: (data: any) => any
  manual?: boolean
  defaultSearchValue?: Record<string, any>
}
function useTable<DataType>(service: any, options?: OptionsType) {
  const table = ref<any>()
  const { loading, openLoading, closeLoading } = useLoading(false, 500)
  const selected = ref<string[]>([])
  const pagination = ref({
    current: 1,
    pageSize: 20,
    total: 0,
  })
  const dataSource = ref<DataType[]>([])
  const search = ref<any>({ ...(options?.defaultSearchValue || {}) })
  let pagatioWatch: WatchStopHandle | undefined
  const run = async (args?: Record<any, any>) => {
    openLoading()
    const params = {
      pageSize: pagination.value.pageSize,
      pageNum: pagination.value.current,
      ...search.value,
      ...args,
    }
    // console.log('params', params)
    if (isFunction(service)) {
      const { data: response, error } = await useCatchAsync(service(params))
      console.log('response', response)
      closeLoading()
      if (error) return false
      if (options && isFunction(options?.formmatter)) {
        const formatResult = options.formmatter(response)
        dataSource.value = formatResult.data
        pagination.value = formatResult.pagination
      } else {
        // 客制化部分
        dataSource.value = response.list
        pagination.value = {
          current: response.pageNum || 1,
          pageSize: response.pageSize || 10,
          total: response.total || 1,
        }
      }

      if (pagatioWatch) pagatioWatch()
      // 开始监听分页变化
      pagatioWatch = watch(pagination, () => run(), {
        deep: true,
      })
      return true
    }
    return closeLoading()
  }
  if (!options?.manual) run()
  return {
    table,
    selected,
    loading,
    pagination,
    dataSource,
    search,
    run,
  }
}

export default useTable
