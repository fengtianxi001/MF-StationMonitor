<template>
  <BaseTableFilter v-model="filter" :configs="configs" :query="query" />
</template>
<script setup lang="ts">
import BaseTableFilter from '@/components/BaseTable/widgets/BaseTableFilter/index.vue'
import { ref } from 'vue'
// interface PropsType {}
// const props = defineProps<PropsType>()

const filter = ref({})
const configs = [
  {
    name: 'demo',
    label: '123',
    component: 'Input',
    defaultValue: '123',
  },
  {
    name: 'demo',
    label: '123',
    component: 'Input',
    defaultValue: '123',
  },
  {
    name: 'demo',
    label: '123',
    component: 'Input',
    defaultValue: '123',
  },
  {
    name: 'demo',
    label: '123',
    component: 'Input',
    defaultValue: '123',
  },
  {
    name: 'demo',
    label: '123',
    component: 'Input',
    defaultValue: '123',
  },
]

const query = (params) => {
  console.log('params', params)
}
</script>
<!-- <style lang="scss" scoped></style> -->
