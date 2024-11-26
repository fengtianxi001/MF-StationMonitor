<template>
  <WidgetPanel title="感知设备规模">
    <div class="item-list">
      <div class="item" v-for="{ icon, label, value } in list">
        <img class="item-icon" :src="icon" />
        <WidgetNumber class="item-number" :value="value" />
        <!-- <div class="item-number">{{ value }}</div> -->
        <div class="item-label">{{ label }}</div>
      </div>
    </div>
  </WidgetPanel>
</template>
<script setup lang="ts">
import WidgetPanel from '../widgetPanel.vue'
import WidgetNumber from '../widgetNumber.vue'
import Icon02 from '../../assets/charge.png'
import Icon03 from '../../assets/sensor_error.png'
import Icon04 from '../../assets/team.png'

const list = [
  { icon: Icon02, label: '高压探测器', value: 36 },
  { icon: Icon02, label: '红外被动探测器', value: 106 },
  { icon: Icon02, label: '溶解氧传感器', value: 36 },
  { icon: Icon02, label: '烟感探测器', value: 72 },
  { icon: Icon02, label: '水浸探测室', value: 79 },
  { icon: Icon02, label: '玻璃破碎探测器', value: 12 },
  { icon: Icon02, label: '风机房', value: 2 },
  { icon: Icon02, label: '巡更锚点', value: 138 },
]
</script>

<style lang="scss" scoped>
.item-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  .item {
    display: grid;
    grid-template-rows: 25px 25px;
    grid-template-columns: 50px 1fr;
    grid-gap: 0 10px;
    justify-content: start;
    .item-icon {
      grid-row: 1 / span 2;
      grid-column: 1;
      width: 44px;
      height: 44px;
      border: 1px solid #02a4f7;
    }
    .item-number {
      font-family: DsDigital;
      font-size: 26px;
      color: #ffe641;
    }
    .item-label {
      margin-top: 6px;
    }
  }
}
</style>
