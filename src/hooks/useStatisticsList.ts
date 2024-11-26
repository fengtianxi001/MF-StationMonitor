import { ref } from 'vue'

interface StatisticsValueType {
  label: string
  value: string
  [key: string]: any
}

export function useStatisticsList<T extends StatisticsValueType[]>(value: T) {
  const list = ref<T>(value)

  const setItem = (label: string, value: any) => {
    const finder = list.value.find((item) => item.label === label)
    if (finder) finder.value = value
  }

  return {
    list,
    setItem,
  }
}

export default useStatisticsList
