<template>
  <Space nowrap>
    <BaseButton v-for="(item, index) in configs" :key="index" :config="item" />
  </Space>
</template>
<script setup lang="ts">
import { Space } from '@arco-design/web-vue'
import BaseButton from './BaseButton.vue'

interface PropsType {
  configs: any[]
}
const props = defineProps<PropsType>()
</script>
