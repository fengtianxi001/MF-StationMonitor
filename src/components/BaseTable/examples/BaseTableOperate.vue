<template>
  <BaseTableOperate :configs="configs" />
</template>
<script setup lang="ts">
import BaseTableOperate from '../widgets/BaseTableOperate/index.vue'
// interface PropsType {}
// const props = defineProps<PropsType>()

const configs = [
  {
    name: '新增工程信息',
    type: 'primary',
    onClick: () => alert(1),
  },
  {
    name: '新增工程信息',
    type: 'primary',
    onClick: () => alert(1),
  },
  {
    name: '新增工程信息',
    type: 'primary',
    onClick: () => alert(1),
  },
]
</script>
<!-- <style lang="scss" scoped></style> -->
