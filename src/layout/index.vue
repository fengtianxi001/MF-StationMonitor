<template>
  <div class="layout">
    <div class="layout-header">
      <div class="header-left"></div>
      <div class="header-midden">电厂数字孪生服务平台</div>
      <div class="header-right"></div>
    </div>
    <div class="layout-main">
      <RouterView />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;

  // background: url(./assets/mask.png) no-repeat;
  background-color: #000;

  // background-size: 100% 100%;
  background-image: radial-gradient(circle, #071433 500px, #000 1000px);
  .layout-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
    background-image: url(./assets/title_bg.png);
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100% 100%;
    .header-left {
      position: absolute;
    }
    .header-midden {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      font-size: 36px;
      font-weight: bold;
      color: #fff;
    }
    .header-right {
      position: absolute;
    }
  }
  .layout-main {
    height: calc(100% - 80px);
  }
}
</style>
