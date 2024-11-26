<template>
  <div class="base-avatar">
    <img v-if="props.src" alt="avatar" :src="src" />
    <IconUser v-else :style="{ fontSize: '14px' }" />
  </div>
</template>
<script setup lang="ts">
import { IconUser } from '@arco-design/web-vue/es/icon'

interface PropsType {
  src: string | undefined
}
const props = defineProps<PropsType>()
</script>
<style lang="scss" scoped>
.base-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  overflow: hidden;
  color: #fff;
  background-color: rgba(var(--primary-6), 0.9);
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
