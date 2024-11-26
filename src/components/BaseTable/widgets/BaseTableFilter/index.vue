<template>
  <div class="base-table-filter">
    <BaseForm
      class="base-table-filter-form"
      v-model="dataValue"
      :configs="configList"
      labelWidth="70px"
    />
    <div
      class="base-table-filter-actions"
      :class="{ column: configs.length > 4 }"
    >
      <Button
        type="primary"
        :loading="searchLoading"
        :disabled="resetLoading"
        @click="actions.onQuery"
      >
        <template #icon> <IconSearch /> </template>
        <template #default>筛选</template>
      </Button>
      <Button
        :loading="resetLoading"
        :disabled="searchLoading"
        @click="actions.onReset"
      >
        <template #icon> <IconRefresh /> </template>
        <template #default>重置</template>
      </Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { isFunction, forEach } from 'lodash'
import { computed, ref, type StyleValue } from 'vue'
import { IconSearch, IconRefresh } from '@arco-design/web-vue/es/icon'
import { Button } from '@arco-design/web-vue'
import { BaseForm, type BaseFormConfigType } from '@/components/BaseForm'
import { onMounted, watch } from 'vue'
import { useLoading } from '../../hooks/useLoading'
import { useCatchAsync } from '../../hooks/useCatchAsync'

interface PropsType {
  modelValue: any
  configs: BaseFormConfigType[]
  query: (params: any) => Promise<any>
}

const props = defineProps<PropsType>()
const emit = defineEmits(['update:modelValue'])

const {
  loading: searchLoading,
  openLoading: openSearchLoading,
  closeLoading: closeSearchLoading,
} = useLoading(false, 500)

const {
  loading: resetLoading,
  openLoading: openResetLoading,
  closeLoading: closeResetLoading,
} = useLoading(false, 500)

const defaultValue = ref<Record<string, any>>({})
const dataValue = ref<Record<string, any>>({})

// 属性适配器
const configList = computed(() => {
  return props.configs.map((config) => {
    return {
      span: 6,
      ...config,
    }
  })
})

// 表单的预处理程序
const preproccess = {
  //默认值回填程序
  defaultValueProcess() {
    forEach(props.configs, (config) => {
      if (!config?.defaultValue) return void 0
      defaultValue.value[config.name] = config?.defaultValue
    })
    defaultValue.value = { ...defaultValue.value, ...props.modelValue }
    emit('update:modelValue', { ...defaultValue.value })
  },
  // modelValue监听程序
  modalValueWaterProcess() {
    watch(
      () => props.modelValue,
      () => {
        const temp: any = {}
        forEach(props.configs, (config) => {
          if (!config.defaultValue) return void 0
          temp[config.name] = config?.defaultValue
        })
        dataValue.value = { ...temp, ...props.modelValue }
      },
      { immediate: true, deep: true }
    )
  },
}

const actions = {
  onQuery: async () => {
    emit('update:modelValue', { ...dataValue.value })
    if (!isFunction(props.query)) return void 0
    openSearchLoading()
    await useCatchAsync(props.query({ current: 1, ...dataValue.value }))
    closeSearchLoading()
    return void 0
  },
  onReset: async () => {
    forEach(props.configs, (config) => {
      if (!config?.defaultValue) return void 0
      defaultValue.value[config.name] = config?.defaultValue
    })
    dataValue.value = { ...defaultValue.value }
    emit('update:modelValue', { ...dataValue.value })
    if (!isFunction(props.query)) return void 0
    openResetLoading()
    await useCatchAsync(props.query({ current: 1 }))
    closeResetLoading()
    return void 0
  },
}

onMounted(() => {
  preproccess.defaultValueProcess()
  preproccess.modalValueWaterProcess()
})
</script>
<style lang="scss" scoped>
.base-table-filter {
  display: flex;
  align-items: center;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--color-neutral-2);
  :deep(.arco-form-layout-inline .arco-form-item) {
    margin: 0;
  }
  .base-table-filter-form {
    grid-gap: 12px 24px;
    margin-top: 0 !important;
    overflow: hidden;
    transition: all 0.35s ease-in-out;
  }
  .base-table-filter-actions {
    display: flex;
    grid-gap: 12px;
    padding-left: 12px;
    margin-left: 12px;
    border-left: 1px solid var(--color-neutral-2);
    &.column {
      flex-direction: column;
    }
  }
}
</style>
