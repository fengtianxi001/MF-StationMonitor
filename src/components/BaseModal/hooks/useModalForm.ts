import { ref } from 'vue'
import { useBaseForm } from '@/components/BaseForm'

// export { default as useForm } from "@/hooks/useForm"

export function useModalForm() {
  const { form, validate, resetFields, clearValidate, setFields } =
    useBaseForm()
  const dataSource = ref<any>({})
  const loading = ref(false)
  return {
    form,
    dataSource,
    loading,
    validate,
    resetFields,
    clearValidate,
    setFields,
  }
}
