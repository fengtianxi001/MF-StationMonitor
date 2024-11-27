<template>
  <div class="dashboard">
    <div class="dashboard-left">
      <widget01></widget01>
      <widget02></widget02>
      <widget03></widget03>
    </div>
    <div class="dashboard-midden" ref="container"></div>
    <div class="dashboard-right">
      <widget05 @startInspect="startInspect" @stopInspect="stopInspect" />
      <widget04 />
    </div>
  </div>
</template>
<script setup lang="ts">
import widget01 from './widgets/widget01/index.vue'
import widget02 from './widgets/widget02/index.vue'
import widget03 from './widgets/widget03/index.vue'
import widget04 from './widgets/widget04/index.vue'
import widget05 from './widgets/widget05/index.vue'
import { useStation } from './hooks/useThree'
const { container, startInspect, stopInspect } = useStation()
</script>
<style lang="scss" scoped>
.dashboard {
  position: relative;
  width: 100%;
  height: 100%;
  .dashboard-left {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 999;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    grid-gap: 20px;
    width: 400px;
    height: calc(100% - 20px);
  }
  .dashboard-midden {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      pointer-events: none;
      content: '';
      background-image: radial-gradient(circle, transparent 30%, #000 70%);
    }
  }
  .dashboard-right {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 999;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    grid-gap: 15px;
    width: 400px;
    height: calc(100% - 20px);
  }
}
</style>
