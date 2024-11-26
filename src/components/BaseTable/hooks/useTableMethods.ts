import { computed, ref } from 'vue'

export function useTableMethods() {
  const table = ref()
  const selected = ref<string[]>([])
  const expanded = ref<string[]>([])

  const isEmptySelected = computed(() => selected.value.length === 0)
  const isEmptyExpanded = computed(() => expanded.value.length === 0)

  const search = computed(() => table.value?.search)
  const data = computed(() => table.value?.data)

  const toggleSelected = (row: any) => {
    const index = selected.value.indexOf(row.id)
    if (index === -1) {
      selected.value.push(row.id)
    } else {
      selected.value.splice(index, 1)
    }
  }

  const toggleExpanded = (row: any) => {
    const index = expanded.value.indexOf(row.id)
    if (index === -1) {
      expanded.value.push(row.id)
    } else {
      expanded.value.splice(index, 1)
    }
  }

  const refresh = () => {
    table.value?.refresh()
    selected.value = []
  }

  return {
    table,
    data,
    search,
    selected,
    expanded,
    isEmptySelected,
    isEmptyExpanded,
    toggleSelected,
    toggleExpanded,
    refresh,
  }
}

export default useTableMethods
