<template>
  <Form
    ref="form"
    layout="inline"
    class="base-form"
    :model="dataSource"
    scroll-to-first-error
    v-bind="{ ...(formProps ?? {}) }"
  >
    <template v-for="config in configList">
      <FormItem
        v-if="config.formItemConfig.visible"
        v-bind="config.formItemConfig"
      >
        <component
          :is="config.formComponentConfig.component"
          v-model="dataSource[config.formComponentConfig.modelKey]"
          v-bind="config.formComponentConfig"
        />
      </FormItem>
    </template>
  </Form>
</template>
<script setup lang="ts">
import { Form, FormItem } from '@arco-design/web-vue'
import { ref, computed, watch, onBeforeMount, onUnmounted } from 'vue'
import { forEach } from 'lodash'
import AttrAdapter from './AttrAdapter'
import type { BaseFormConfigType } from '../../types'

interface PropsType {
  configs: BaseFormConfigType[]
  modelValue: any
  labelWidth?: string
  formProps?: any
}

const props = withDefaults(defineProps<PropsType>(), {
  labelWidth: '100px',
})

const emit = defineEmits(['update:modelValue'])

const form = ref()

const dataSource = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 属性适配器[将非标属性转换为arco-form的标准属性]
const configList = computed(() => {
  return props.configs.map((config) => {
    // 表单项配置
    const formItemConfig = {
      visible: config.visible !== false,
      key: config.name,
      field: config.name,
      name: config.name,
      label: config.label,
      disabled: config.disabled,
      required: config.required,
      labelColFlex: props.labelWidth,
      rules: AttrAdapter.formItemRules(config),
      style: AttrAdapter.formItemStyle(config),
      ...AttrAdapter.formItemProps(config),
    }
    // 表单组件配置
    const formComponentConfig = {
      component: AttrAdapter.formComponent(config),
      modelKey: config.name,
      allowClear: true,
      allowSearch: true,
      placeholder: AttrAdapter.formComponentPlaceholder(config),
      ...AttrAdapter.formComponentFilter(config),
      ...AttrAdapter.formComponentProps(config),
    }

    return {
      formItemConfig,
      formComponentConfig,
    }
  })
})

// 表单的预处理程序
const preproccess = {
  //默认值回填程序
  defaultValueProcess() {
    const originalValue: any = {}
    forEach(props.configs, (config) => {
      if (config?.defaultValue !== undefined) {
        originalValue[config.name] = config?.defaultValue
      }
    })

    emit('update:modelValue', originalValue)
  },
  // 配置项依赖监听程序
  dependentListenProcess() {
    forEach(props.configs, (config) => {
      const depends = config?.depends
      if (!depends) return void 0
      const source = () => depends.keys.map((dep: any) => dataSource.value[dep])
      const cb = (params: any) => depends?.handler(params, config)
      const options = { immediate: depends.immediate }
      const watcher = watch(source, cb, options)
      onUnmounted(() => watcher())
      return void 0
    })
  },
  //配置项的显示隐藏程序[当表单项隐藏时,是否删除该字段的值]
  itemVisibleProcess() {
    const source = () => props.configs
    const cb = (configs: any) => {
      forEach(configs, (config) => {
        if (config.clearValueOnHidden && config.visible === false) {
          delete dataSource.value[config.name]
        }
      })
    }
    const options = { deep: true, immediate: true }
    const watcher = watch(source, cb, options)
    onUnmounted(() => watcher())
  },
}

onBeforeMount(() => {
  preproccess.defaultValueProcess()
  preproccess.dependentListenProcess()
  preproccess.itemVisibleProcess()
})

defineExpose({
  form,
  validate: () => form.value?.validate(),
  // 校验部分表单数据
  validateField: (field: string | string[]) => form.value?.validateField(field),
  // 重置表单数据
  resetFields: (field: string | string[]) => form.value?.resetFields(field),
  // 清除校验状态
  clearValidate: (field: string | string[]) => form.value?.clearValidate(field),
  // 设置表单项的值和状态
  setFields: (fields: Record<string, any>) => form.value?.setFields(fields),
})
</script>
<style lang="scss">
.base-form {
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  .arco-form-item {
    margin-bottom: 24px;
    &.arco-form-item-error,
    .arco-form-item.arco-form-item-has-help {
      margin-bottom: 0;
    }
  }
}
</style>
