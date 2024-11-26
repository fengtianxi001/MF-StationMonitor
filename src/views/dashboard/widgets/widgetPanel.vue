<template>
  <div class="widget-panel">
    <div class="panel-header">{{ title }}</div>
    <div class="panel-body">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
interface PropsType {
  title: string
}
const props = defineProps<PropsType>()
</script>
<style lang="scss" scoped>
.widget-panel {
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    font-size: 20px;
    font-weight: bold;
    color: #02a4f7;
    background: linear-gradient(
      90deg,
      rgba(2, 164, 247, 0%),
      rgba(2, 164, 247, 37%),
      rgba(2, 164, 247, 3%)
    );
    border-left: 4px solid #02a4f7;
  }
  .panel-body {
    box-sizing: border-box;
    padding: 20px;
    overflow: hidden;
    color: #fff;
    background-image: radial-gradient(#7775 50%, #0002 0);
    background-size: 6px 6px;
  }
}
</style>
