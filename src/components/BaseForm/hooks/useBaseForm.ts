import { ref } from 'vue'
import { isFunction } from 'lodash'
import type { FieldData } from '@arco-design/web-vue/es/form/interface'

export function useBaseForm() {
  const form = ref()
  const data = ref({})
  // 校验全部表单数据
  const validate = () => {
    const rawValidate = form.value?.validate
    if (isFunction(rawValidate)) return rawValidate()
    return Promise.resolve({})
  }

  // 校验部分表单数据
  const validateField = (field: string | string[]) => {
    const rawValidateField = form.value?.validateField
    if (isFunction(rawValidateField)) return rawValidateField(field)
    return Promise.resolve({})
  }

  // 重置表单数据
  const resetFields = (field?: string | string[]) => {
    const rawResetFields = form.value?.resetFields
    if (isFunction(rawResetFields)) return rawResetFields(field)
    return Promise.resolve()
  }

  // 清除校验状态
  const clearValidate = (field: string | string[]) => {
    const rawClearValidate = form.value?.clearValidate
    if (isFunction(rawClearValidate)) return rawClearValidate(field)
    return Promise.resolve()
  }

  // 设置表单项的值和状态
  const setFields = (data: Record<string, FieldData>) => {
    const rawSetFields = form.value?.setFields
    if (isFunction(rawSetFields)) return rawSetFields(data)
    return Promise.resolve()
  }

  return {
    form,
    data,
    validate,
    validateField,
    resetFields,
    clearValidate,
    setFields,
  }
}

export default useBaseForm
