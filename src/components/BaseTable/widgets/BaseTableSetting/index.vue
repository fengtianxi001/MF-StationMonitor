<template>
  <Space nowrap :size="14">
    <FilterToggle
      v-show="filterVisible !== false"
      :filter="filter"
      :onFilter="onFilter"
    />
    <LineHeight v-show="sizeVisible !== false" :size="size" :onSize="onSize" />
    <Refresh v-show="refreshVisible !== false" :onRefresh="refresh" />
  </Space>
</template>
<script setup lang="ts">
import { Space } from '@arco-design/web-vue'
import LineHeight from './LineHeight.vue'
import FilterToggle from './FilterToggle.vue'
import Refresh from './Refresh.vue'

interface PropsType {
  sizeVisible?: boolean
  filterVisible?: boolean
  refreshVisible?: boolean
  size: 'mini' | 'small' | 'medium' | 'large'
  filter: boolean
  refresh: (args?: Record<any, any> | undefined) => Promise<boolean | void>
}
const props = defineProps<PropsType>()

const emit = defineEmits(['update:size', 'update:filter'])

const onFilter = (value: any) => emit('update:filter', value)

const onSize = (value: any) => emit('update:size', value)
</script>
