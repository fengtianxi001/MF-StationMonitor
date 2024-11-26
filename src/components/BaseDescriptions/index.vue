<template>
  <Descriptions class="base-descriptions" :title="title" :column="column">
    <DescriptionsItem
      v-for="config of configs"
      :label="adapter.itemLabel(config)"
    >
      <component :is="builder(mode, config)"></component>
    </DescriptionsItem>
  </Descriptions>
</template>
<script setup lang="tsx">
import * as arco from '@arco-design/web-vue'
import { Descriptions, DescriptionsItem } from '@arco-design/web-vue'
import { isNil } from 'lodash'

interface PropsType {
  title: string
  mode: 'preview' | 'edit'
  modelValue: any
  configs: any[]
  column?: number
}

const props = withDefaults(defineProps<PropsType>(), {
  mode: 'preview',
})

const builder = (mode: any, config: any) => {
  if (mode === 'preview') {
    const value = props.modelValue[config.name]
    const content = isNil(value) ? '暂无数据' : value
    const style = isNil(value) ? { color: 'var(--color-fill-4)' } : {}
    return <span style={style}>{content}</span>
  } else {
    const component = arco[config.component]
    return (
      <component
        v-model={props.modelValue[config.name]}
        size="mini"
        {...(config.props || {})}
        placeholder={adapter.itemPlaceholder(config)}
      />
    )
  }
}
const adapter = {
  itemLabel(config: any) {
    if (!config.append) return config.label
    return `${config.label} [${config.append}]`
  },
  itemPlaceholder(config: any) {
    const InputTypeList = [
      'Input',
      'InputNumber',
      'InputPassword',
      'InputTag',
      'Mention',
      'Textarea',
    ]
    const action = InputTypeList.includes(config.component) ? '输入' : '选择'
    return `请${action}${config.label}`
  },
}
</script>
<style lang="scss">
.base-descriptions {
  .arco-descriptions-body {
    border-radius: 0;
  }
  .arco-descriptions-title {
    box-sizing: border-box;
    padding-left: 20px;
    margin-bottom: 0;
    font-size: 14px;
    line-height: 32.5px;

    // color: var(--color-text-1);
    color: var(--color-text-2);
    text-align: left;
    background-color: var(--color-fill-3);
    border: 1px solid var(--color-neutral-3);
    border-bottom: none;
  }
}
</style>
