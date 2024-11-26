<template>
  <div class="container" :class="{ active: filter }" @click="onFilter">
    <IconFilter />
  </div>
</template>
<script setup lang="ts">
import { IconFilter } from '@arco-design/web-vue/es/icon'

interface PropsType {
  filter: boolean
  onFilter: any
}
const props = defineProps<PropsType>()

const onFilter = async () => {
  props.onFilter(!props.filter)
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 18px;
  font-weight: normal;
  color: rgb(var(--gray-10));
  cursor: pointer;
  background-color: var(--color-secondary);
  border-radius: var(--border-radius-small);
  transition: all 0.1s cubic-bezier(0, 0, 1, 1);
  &:hover {
    color: var(--color-text-2);
    background-color: var(--color-secondary-hover);
  }
  &.active {
    color: #fff;
    background-color: rgb(var(--primary-6));
  }
}
</style>
