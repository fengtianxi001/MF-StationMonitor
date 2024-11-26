<template>
  <div class="base-empty">
    <Empty />
  </div>
</template>
<script setup lang="ts">
import { Empty } from '@arco-design/web-vue'
// interface PropsType {}
// const props = defineProps<PropsType>()
</script>
<style lang="scss" scoped>
.base-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
