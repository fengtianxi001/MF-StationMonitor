<template>
  <WidgetPanel title="变电站操作台">
    <div class="item-list">
      <div class="item">模拟设备告警</div>
      <div class="item">推送告警</div>
      <div class="item" @click="toggleInspect">
        {{ state.inspecting ? '取消漫游' : '漫游巡检' }}
      </div>
      <div class="item">实时监控</div>
    </div>
  </WidgetPanel>
</template>
<script setup lang="ts">
import WidgetPanel from '../widgetPanel.vue'
import { reactive } from 'vue'
const state = reactive({
  inspecting: false,
})
const emit = defineEmits(['startInspect', 'stopInspect'])

const toggleInspect = () => {
  if (state.inspecting) {
    emit('stopInspect')
  } else {
    emit('startInspect')
  }
  state.inspecting = !state.inspecting
}
</script>

<style lang="scss" scoped>
.item-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;

    // background-image: radial-gradient(#02a4f720 50%, transparent 0);
    // background-size: 6px 6px;
    border: 1px solid #02a4f7;
  }
}
</style>
