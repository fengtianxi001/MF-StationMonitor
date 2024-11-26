<template>
  <div style="height: 100%" ref="wrap">
    <component :is="container" :title="title" style="height: 100%">
      <BaseTableFilter
        v-if="tableFilter && tableFilterVisible"
        v-model="search"
        :configs="tableFilter"
        :query="() => run({ pageNum: 1 })"
        :loading="loading"
        v-bind="filerOptions"
        :style="{ marginTop: card ? '8px' : '0px' }"
      />
      <div v-if="!isEmpty(tableOperates)" class="base-table-middle">
        <BaseTableOperate :configs="tableOperates" />
        <BaseTableSetting
          v-if="setting"
          :filterVisible="!isEmpty(tableFilter)"
          :refreshVisible="true"
          v-model:size="size"
          v-model:filter="tableFilterVisible"
          :refresh="run"
        />
      </div>
      <BaseTable
        class="base-table-pro-main"
        v-model:selectedKeys="selectedKeys"
        v-model:expandedKeys="expandedKeys"
        :columns="tableColumns"
        :data="dataSource"
        :pagination="pagination"
        :stripe="true"
        v-bind="{ selection, ...tabelProps }"
        :size="size"
        :loading="loading"
      />
    </component>
  </div>
</template>
<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { isArray, isEmpty } from 'lodash'
import useTable from '../../hooks/useTable'
import BaseTableFilter from '../BaseTableFilter/index.vue'
import BaseTable from '../BaseTable/index.vue'
import BaseTableOperate from '../BaseTableOperate/index.vue'
import BaseTableSetting from '../BaseTableSetting/index.vue'
import BasePanel from '@/components/BasePanel/index.vue'

interface PropsType {
  title?: string
  card?: boolean
  service: any
  selection?: 'checkbox' | 'radio'
  setting?: boolean
  tableColumns: any
  tableFilter?: any
  tableOperates?: any
  filerOptions?: any
  tabelProps?: any
  manual?: boolean
  defaultSearchValue?: any
  selected?: any[]
  expanded?: any[]
}

const props = withDefaults(defineProps<PropsType>(), {
  card: true,
  title: '',
  selection: undefined,
  setting: true,
  tableFilter: false,
  tableOperates: [],
  filerOptions: {},
  tabelProps: {},
  manual: false,
  defaultSearchValue: {},
})

const container = computed(() =>
  props.card === false ? h('div', { class: 'base-table-pro-div' }) : BasePanel
)
const size = ref<'mini' | 'small' | 'medium' | 'large'>('small')
const emit = defineEmits(['update:selected', 'update:expanded'])

const selectedKeys = computed({
  get: () => props.selected,
  set: (val) => emit('update:selected', val),
})

const expandedKeys = computed({
  get: () => props.expanded,
  set: (val) => emit('update:expanded', val),
})

const tableFilterVisible = ref(true)

const { loading, dataSource, search, selected, pagination, run } = useTable(
  props.service,
  {
    manual: true,
    defaultSearchValue: props.defaultSearchValue,
    onFinally: () => emit('update:selected', []),
  }
)

const initDefaultValue = () => {
  if (props.tableFilter && isArray(props.tableFilter)) {
    props.tableFilter.forEach((config: any) => {
      if (!config.defaultValue) return void 0
      search.value[config.name] = config.defaultValue
    })
  }
  if (!props.manual) run()
}

initDefaultValue()

const tableColumns = computed(() => {
  const indexColumns = {
    title: '序号',
    width: 55,
    // fixed: 'left',
    align: 'center',
    cellClass: 'base-table-pro-index',
    render: ({ rowIndex }: any) =>
      pagination.value.pageSize * (pagination.value.current - 1) + rowIndex + 1,
  }
  return [indexColumns, ...props.tableColumns]
})

defineExpose({
  search,
  data: dataSource,
  selected,
  refresh: (params?: any) => run(params),
})
</script>

<style lang="scss" scoped>
.base-table-middle {
  display: flex;
  justify-content: space-between;
}
</style>
<style lang="scss">
.base-table-pro-div {
  display: flex;
  flex-direction: column;
  grid-gap: 10px;
  height: 100%;
}
.base-table-middle,
.base-table-pro-main {
  &:not(:first-child) {
    margin-top: 10px;
  }
}
.base-table-pro-index {
  .arco-table-cell {
    padding: 0;
  }
}
</style>
