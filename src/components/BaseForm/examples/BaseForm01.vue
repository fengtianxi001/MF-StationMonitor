<template>
  <div class="base-form-example-01">
    <div class="container">
      <BaseForm ref="baseForm" class="demo" v-model="dataSource" :fieldNames="fieldNames" :configs="configs" />
    </div>
    <div class="container">
      <button @click="onClick">校验</button>
      {{ dataSource }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseForm from '../widgets/BaseForm/index.vue'

const dataSource = ref<any>({})

const baseForm = ref()

const fieldNames = {
  field: 'prop',
  label: 'label',
}

const configs = computed(() => [
  {
    label: '查验内容',
    name: 'content1',
    component: 'Input',
    span: 24,
    defaultValue: '默认值',
  },
  {
    label: '查验内容',
    name: 'content1',
    component: 'Input',
    span: 24,
    defaultValue: '默认值',
  },
  {
    label: '代码',
    name: 'code',
    component: 'CodeEditor',
    span: 24,
    required: true,
    defaultValue: JSON.stringify({
      total: 7448,
      size: 20,
      current: 1,
      orders: [],
      optimizeCountSql: true,
      hitCount: false,
      searchCount: true,
      pages: 373,
    }),
  },
])

const onClick = () => {
  baseForm.value.validate().then((res: any) => {
    console.log('res', res)
  })
}
</script>
<style lang="scss" scoped>
.base-form-example-01 {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  background-color: #f0f1f3;
  .container {
    box-sizing: border-box;

    // height: 100px;
    padding: 20px;
    overflow: auto;
    background-color: #fff;
    .demo {
      border: 1px solid red;
    }
  }
}
</style>
