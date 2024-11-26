<template>
  <BaseModal
    :title="title"
    :onBeforeConfirm="onBeforeConfirm"
    :loading="loading"
    :body-style="{ padding: '20px 15px 0px' }"
  >
    <slot></slot>
    <BaseForm
      ref="form"
      v-model="dataSource"
      auto-label-width
      size="small"
      :configs="configs"
      :loading="loading"
      :layout="layout"
      :labelWidth="labelWidth"
      :formProps="formProps"
    />
  </BaseModal>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { BaseForm, useBaseForm } from '@/components/BaseForm'
import BaseModal from '@/components/BaseModal/src/BaseModal.vue'

interface PropsType {
  title: string
  loading: boolean
  modelValue: any
  configs: any
  onBeforeConfirm: any
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelWidth?: string | undefined
  formProps?: any
}
const props = defineProps<PropsType>()
const emit = defineEmits(['update:modelValue'])

const dataSource = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const { form, validate } = useBaseForm()

defineExpose({
  form,
  validate,
})
</script>
