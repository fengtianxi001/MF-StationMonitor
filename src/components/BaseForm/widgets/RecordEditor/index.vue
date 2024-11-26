<template>
  <Table
    class="record-editor"
    style="width: 100%"
    size="mini"
    :columns="[...tableColumns, actionColumn]"
    :data="modelValue"
    :hoverable="false"
    :bordered="{ wrapper: true, cell: true, bodyCell: true }"
    :pagination="false"
  >
    <template
      v-for="column in slotList"
      #[column.slotName]="{ record, rowIndex }"
    >
      <template v-if="!column.component">
        {{ modelValue[rowIndex][column.dataIndex] }}
      </template>
      <component
        v-else
        :is="column.component"
        :placeholder="column.title"
        v-bind="generate.columnProps(column.props, record, rowIndex)"
        v-model="modelValue[rowIndex][column.dataIndex]"
        size="mini"
      />
    </template>

    <template #actions="{ record, rowIndex }">
      <Link size="mini" @click="actions.onDelete(rowIndex)">删除</Link>
    </template>
    <template #footer>
      <Button size="small" long @click="actions.onCreate">添加一行</Button>
    </template>
  </Table>
</template>
<script setup lang="tsx">
import { Table, Link, Button, TableColumn } from '@arco-design/web-vue'
import { computed } from 'vue'
import * as arco from '@arco-design/web-vue'
import { isArray, isFunction, isString } from 'lodash'

interface PropsType {
  columns: Array<any>
  modelValue: any
}
const props = defineProps<PropsType>()

const emit = defineEmits(['update:modelValue'])

const components: any = {
  ...arco,
}

const generate = {
  columnProps: (prop: any, record: any, index: number) => {
    if (isFunction(prop)) {
      return prop({ record, index })
    }
    return { ...prop }
  },
}

const tableColumns = computed<any[]>(() => {
  //需要考虑表头合并的情况
  const loop = (arr: any[]) => {
    return arr.map((item) => {
      item.component = isString(item.component)
        ? components[item.component]
        : item.component
      item.slotName = item.dataIndex
      if (item.children) {
        item.children = loop(item.children)
      }
      return item
    })
  }
  return loop(props.columns)
})

const slotList = computed<any[]>(() => {
  //需要考虑表头合并的情况
  const list: any[] = []
  const loop = (arr: any[]) => {
    arr.forEach((item) => {
      item.component = isString(item.component)
        ? components[item.component]
        : item.component
      item.slotName = item.dataIndex
      if (item.children) {
        loop(item.children)
      }
      list.push(item)
    })
  }
  loop(props.columns)
  return list
})

const actionColumn = {
  title: '操作',
  width: 70,
  slotName: 'actions',
  align: 'center',
}

const actions = {
  onCreate: () => {
    if (isArray(props.modelValue)) {
      emit('update:modelValue', [...props.modelValue, {}])
    } else {
      emit('update:modelValue', [{}])
    }
  },
  onDelete: (index: number) => {
    if (isArray(props.modelValue)) {
      const copy = [...props.modelValue]
      copy.splice(index, 1)
      emit('update:modelValue', copy)
    }
  },
}
</script>

<style lang="scss">
.record-editor {
  .arco-table-cell {
    padding: 4px !important;
  }
  .arco-table-footer {
    padding: 5px !important;
  }
  .arco-upload-list-item {
    margin-top: 5px !important;
    .arco-upload-list-item-content {
      padding: 4px 8px !important;
    }
    .arco-upload-list-item-name {
      font-size: 12px !important;
    }
    &:first-of-type {
      margin-top: 5px !important;
    }
  }
}
</style>
