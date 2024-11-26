<template>
  <div class="base-loading">
    <IconLoading class="loading-dots" />
    <span>{{ msg }}</span>
  </div>
</template>
<script setup lang="ts">
import { IconLoading } from '@arco-design/web-vue/es/icon'
interface Props {
  msg?: string
}
const props = defineProps<Props>()
</script>
<style lang="scss" scoped>
.base-loading {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #0092fc;
  background-color: var(--color-spin-layer-bg);
  .loading-dots {
    margin-bottom: 10px;
    font-size: 20px;
  }
}
</style>
