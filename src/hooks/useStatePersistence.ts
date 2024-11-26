import { isFunction } from 'lodash'
import { ref, watch } from 'vue'

interface Options<T> {
  defaultValue?: T | (() => T)
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
}

/**
 * useStatePersistence
 * - defaultValue(非必填): 默认值
 * - serializer(非必填): 序列化方法
 * - deserializer(非必填): 反序列化方法
 */

export function useStatePersistence<T>(key: string, options?: Options<T>) {
  const storage = window.localStorage
  const serializer = (value: T) => {
    if (options?.serializer) {
      return options?.serializer(value)
    }
    return JSON.stringify(value)
  }
  const deserializer = (value: string) => {
    if (options?.deserializer) {
      return options?.deserializer(value)
    }
    return JSON.parse(value)
  }
  function getStoredValue() {
    try {
      const raw = storage?.getItem(key)
      if (raw) {
        return deserializer(raw)
      }
    } catch (e) {
      // console.error(e);
    }
    if (isFunction(options?.defaultValue)) {
      return options?.defaultValue()
    }
    return options?.defaultValue
  }

  const state = ref<T>(getStoredValue())
  watch(
    state,
    () => {
      // @ts-ignore
      storage?.setItem(key, serializer(state.value))
    },
    {
      deep: true,
      immediate: true,
    }
  )
  return state
}

export default useStatePersistence
