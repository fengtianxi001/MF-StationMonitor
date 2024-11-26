<template>
  <Table
    ref="table"
    class="base-table"
    :data="dataSource"
    :loading="loading"
    v-model:selectedKeys="selectedKeys"
    v-model:expandedKeys="expandedKeys"
    v-bind="{ ...tableProps, ...$attrs }"
  >
    <template v-for="(_, scopeSlotName) in $slots" #[scopeSlotName]="scope">
      <slot :name="scopeSlotName" v-bind="scope" />
    </template>
  </Table>
</template>

<script setup lang="ts">
import { useRequest } from '@/hooks'
import { Table } from '@arco-design/web-vue'
import { computed, ref } from 'vue'
import AttrAdapter from './AttrAdapter'

interface PropsType {
  service: any
  columns: any[]
  selection?: 'checkbox' | 'radio'
  selected?: any[]
  expanded?: any[]
}

const props = defineProps<PropsType>()
const emit = defineEmits(['update:selected', 'update:expanded'])
const table = ref()

const tableProps = computed(() =>
  AttrAdapter.tableProps(props.columns, props.selection)
)

const selectedKeys = computed({
  get: () => props.selected,
  set: (val) => emit('update:selected', val),
})

const expandedKeys = computed({
  get: () => props.expanded,
  set: (val) => emit('update:expanded', val),
})

const { dataSource, loading, run } = useRequest(props.service, {
  defaultData: [],
  resultFormat: (res) => res,
  onFinally: () => emit('update:selected', []),
})

defineExpose({ table })
</script>

<style lang="scss">
.base-table {
  position: relative;
  flex: 1;
  overflow: auto;
  table-layout: fixed;
  border-collapse: collapse;
  .arco-spin {
    height: unset;
  }
  .arco-table-content-scroll-x {
    overflow-x: unset;
    overflow-y: unset;
  }
  thead {
    tr {
      position: sticky;
      top: 0;
      z-index: 99;
    }

    user-select: none;
  }
  .arco-table-td-content:empty::before {
    display: block;
    color: var(--color-fill-4);
    content: '--';
  }
}
</style>
