<template>
  <WidgetPanel title="主设备规模">
    <div class="item-list">
      <div class="item" v-for="{ icon, label, value, unit } in list">
        <img class="item-icon" :src="icon" alt="" />
        <div class="item-label">{{ label }}</div>
        <WidgetNumber class="item-number" :value="value" />
        <div class="item-unit">{{ unit }}</div>
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
  {
    icon: Icon03,
    label: '变压器220KV',
    value: 248,
    unit: '台',
  },
  {
    icon: Icon02,
    label: '开关柜35KV',
    value: 343,
    unit: '台',
  },
  {
    icon: Icon04,
    label: '接地变110V',
    value: 1545,
    unit: '台',
  },
  //   {
  //     icon: Icon02,
  //     label: '电缆110V',
  //     value: 248,
  //     unit: '台',
  //   },
  {
    icon: Icon03,
    label: 'GIS 220V间隔',
    value: 3234,
    unit: '台',
  },
]
</script>

<style lang="scss" scoped>
.item-list {
  display: flex;
  flex-direction: column;
  grid-gap: 15px;
  .item {
    display: flex;
    grid-gap: 10px;
    align-items: center;
    .item-icon {
      width: 44px;
      height: 44px;
    }
    .item-label {
      flex: 1;
      font-size: 18px;
    }
    .item-number {
      font-family: DsDigital;
      font-size: 26px;
      color: #ffe641;
    }
    .item-unit {
      font-size: 18px;
    }
  }
}
</style>
