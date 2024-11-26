<template>
  <BaseTable :columns="tableColumns" selection="radio" :data="data" />
</template>
<script setup lang="tsx">
import BaseTable from '@/components/BaseTable/widgets/BaseTable/index.vue'

const tableColumns: any = [
  {
    title: '项目名称',
    dataIndex: 'itemName',
    align: 'left',
  },
  {
    title: '默认配置',
    dataIndex: 'itemDefault',
    align: 'center',
    ellipsis: true,
    tooltip: true,
  },
  {
    title: '操作',
    align: 'right',
    width: 300,
  },
]

const data = [{}]
</script>
<!-- <style lang="scss" scoped></style> -->
