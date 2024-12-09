<template>
  <div class="label" @click="onClick">{{ name }}</div>
</template>
<script setup lang="ts">
interface PropsType {
  name: string
}
const props = defineProps<PropsType>()

const onClick = () => {
  alert(props.name)
}
</script>
<style lang="scss" scoped>
.label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 135px;
  height: 40px;
  font-weight: bolder;
  color: #fff;
  pointer-events: all;
  cursor: pointer;
  background-image: url(@/assets/label_bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
