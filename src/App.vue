<template>
  <div class="layout">
    <LayoutHeader />
    <LayoutFooter />
    <LayoutLoading :loading="loading" />
    <div class="layout-main">
      <div class="main-left">
        <WidgetPanel04 />
        <WidgetPanel02 />
        <WidgetPanel03 />
      </div>
      <div class="main-right">
        <WidgetPanel01 />
        <WidgetPanel05 />
        <WidgetPanel06 />
      </div>
      <div class="main-middle" ref="container"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import LayoutHeader from '@/components/LayoutHeader.vue'
import LayoutFooter from '@/components/LayoutFooter.vue'
import LayoutLoading from '@/components/LayoutLoading.vue'

import WidgetPanel01 from '@/components/WidgetPanel01.vue'
import WidgetPanel02 from '@/components/WidgetPanel02.vue'
import WidgetPanel03 from '@/components/WidgetPanel03.vue'
import WidgetPanel04 from '@/components/WidgetPanel04.vue'
import WidgetPanel05 from '@/components/WidgetPanel05.vue'
import WidgetPanel06 from '@/components/WidgetPanel06.vue'

import { useStation } from '@/hooks/useStation'
import { provide } from 'vue'
const {
  container,
  loading,
  startInspect,
  stopInspect,
  startWarming,
  stopWarming,
} = useStation()

provide('events', { startInspect, stopInspect, startWarming, stopWarming })
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;
  background-color: #000;
  background-image: url(@/assets/page_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .layout-main {
    position: relative;
    width: 100%;
    height: calc(100% - 80px);
    .main-left {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 999;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      grid-gap: 20px;
      width: 420px;
      height: calc(100% - 20px);
    }
    .main-right {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 999;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      grid-gap: 20px;
      width: 420px;
      height: calc(100% - 20px);
    }
    .main-middle {
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
        z-index: 99;
        width: 100%;
        height: 100%;
        pointer-events: none;
        content: '';
        background-image: radial-gradient(circle, transparent 30%, #000 60%);
      }
    }
  }
}
</style>
