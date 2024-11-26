<template>
  <div class="base-panel" :style="style">
    <div class="panel-header" v-if="$slots.extra || title">
      <div class="panel-header-title">{{ props.title }}</div>
      <div class="panel-header-slot">
        <slot name="extra"></slot>
      </div>
    </div>
    <div class="panel-body">
      <BaseLoading v-if="loading" />
      <!-- <BaseEmpty v-else-if="empty" /> -->
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import BaseLoading from '../BaseLoading/index.vue'
// import BaseEmpty from '../BaseEmpty/index.vue'

interface PropsType {
  row?: number
  column?: number
  title?: string
  loading?: boolean
  empty?: boolean
}
const props = defineProps<PropsType>()

const style = computed(() => {
  const cache: any = {}
  if (props.column) cache['grid-column'] = `span ${props.column}`
  if (props.row) cache['grid-row'] = `span ${props.row}`
  return cache
})
</script>
<style lang="scss">
.base-panel {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 10px;
  overflow: hidden;
  background-color: var(--color-bg-2);

  // border: 1px solid var(--color-border);

  // border-radius: 6px;
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    .panel-header-title {
      position: relative;
      margin-left: 10px;
      font-size: 16px;
      font-weight: bold;
      color: var(--color-text-1);
      &::before {
        position: absolute;
        left: -10px;
        width: 5px;
        height: 18px;
        content: '';
        background-color: #008cf8;
        border-radius: 1px;
      }
    }
    .panel-header-slot {
      display: flex;
      grid-gap: 4px;
    }
  }
  .panel-body {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    .panel-body-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
