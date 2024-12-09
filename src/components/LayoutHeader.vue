<template>
  <div class="layout-header">
    <div class="header-midden">
      <div class="cn">电厂数字孪生服务平台</div>
      <div class="en">Power plant digital twin service platform</div>
    </div>
    <div class="header-left">
      <i class="fa-regular fa-envelope"></i>
      <div
        class="message"
        content="【系统通知】感谢大家对我们项目的关注与支持!希望能为我们的项目点一个Star,您的支持对我们来说至关重要。"
      ></div>
    </div>
    <div class="header-right">
      <span>12:00:00</span>
      <span>2024-12-34</span>
      <span>Monday</span>
      <span>13°c</span>
    </div>
  </div>
</template>
<script setup lang="ts">
// interface PropsType {}
// const props = defineProps<PropsType>()
</script>
<style lang="scss" scoped>
@mixin font-color() {
  background: linear-gradient(0deg, #b9cfff 0%, #fff 99%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
@keyframes text-roll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
@keyframes light-go {
  from {
    left: 500px;
  }
  to {
    left: 1100px;
    opacity: 0;
  }
}
.layout-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  background-image: url(@/assets/title_bg.png);
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% 100%;
  &::after {
    position: absolute;
    bottom: -55px;
    left: 500px;
    width: 100%;
    width: 500px;
    height: 100px;
    content: '';
    background-image: url(@/assets/light_bg.png);
    background-repeat: no-repeat;
    background-size: contain;
    animation: light-go 3s ease-in-out infinite forwards;
  }
  .header-midden {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow-x: hidden;
    font-family: DouYu;
    color: #fff;
    .cn {
      font-size: 30px;
      @include font-color;
    }
    .en {
      position: relative;
      font-size: 10px;
      @include font-color;
    }
  }
  .header-left {
    position: absolute;
    top: 20px;
    left: 30px;
    display: flex;
    grid-gap: 6px;
    align-items: center;
    font-size: 18px;
    color: #fff;
    .message {
      display: flex;
      width: 400px;
      overflow: hidden;
      font-size: 16px;
      &::after {
        width: auto;
        text-wrap: nowrap;
        content: attr(content);
        animation: text-roll 20s linear infinite;
        @include font-color;
      }
    }
  }
  .header-right {
    position: absolute;
    top: 20px;
    right: 30px;
    display: flex;
    grid-gap: 20px;
    font-size: 16px;
    color: #fff;
    span {
      position: relative;
      display: flex;
      align-items: center;
      text-shadow: 0 3px 2px #84a8f663;
      @include font-color;
      &:not(:last-child)::after {
        position: absolute;
        right: -10px;
        width: 2px;
        height: 10px;
        content: '';
        background-color: #fff;
        opacity: 0.2;
      }
    }
  }
}
</style>
