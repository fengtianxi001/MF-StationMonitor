<template>
  <div v-if="page" class="base-table-pagination">
    <div>
      <span style="color: rgb(var(--gray-10))">共</span>
      <Link>{{ page.total }}</Link>
      <span style="color: rgb(var(--gray-10))">条数据</span>
    </div>
    <Pagination
      v-model:current="page.current"
      v-model:page-size="page.pageSize"
      :total="page.total"
      :show-total="false"
      :page-size-options="[5, 10, 20, 50, 100]"
      show-page-size
      v-bind="{ ...paginationProps }"
    />
  </div>
</template>
<script setup lang="ts">
import { Pagination, Link } from '@arco-design/web-vue'
import { computed } from 'vue'

interface PropsType {
  pagination?: {
    current: number
    pageSize: number
    total: number
  } | null
  paginationProps?: any
}
const props = defineProps<PropsType>()
const emit = defineEmits(['update:pagination'])
const page = computed({
  get: () => props.pagination,
  set: (value) => emit('update:pagination', value),
})
</script>
<style lang="scss" scoped>
.base-table-pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
