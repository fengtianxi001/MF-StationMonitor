<template>
  <Dropdown
    class="base-contentmenu"
    trigger="contextMenu"
    alignPoint
    position="bl"
  >
    <slot></slot>
    <template #content>
      <Doption
        v-for="(item, index) in configs"
        :key="index"
        class="contextmenu-item"
        :disabled="item.disabled"
        @click="item.click"
      >
        <template v-if="item.icon" #icon>
          <component :is="item.icon" />
        </template>
        <template #default>{{ item.label }}</template>
      </Doption>
    </template>
  </Dropdown>
</template>
<script setup lang="ts">
import { Dropdown, Doption } from '@arco-design/web-vue'

interface PropsType {
  configs: {
    label: string
    disabled?: boolean
    icon?: any
    click: () => void
  }[]
}
defineProps<PropsType>()
</script>
<style lang="scss">
.base-contentmenu {
  .arco-dropdown {
    padding: 4px;
    .arco-dropdown-option {
      padding: 0 8px;
      font-size: 11px;
      line-height: 30px;
    }
  }

  font-size: 12px;
}
</style>
