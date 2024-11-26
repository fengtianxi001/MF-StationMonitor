<template>
  <Upload
    action="/"
    :file-list="dataSource"
    :customRequest="actions.onUpload"
    @beforeRemove="actions.onRemove"
  />
</template>
<script setup lang="ts">
import { Upload } from '@arco-design/web-vue'
import { uniqueId } from 'lodash'
import { watch, ref } from 'vue'

interface PropsType {
  modelValue: any
  list?: any
}
const props = defineProps<PropsType>()

const dataSource = ref<any[]>([])

const emit = defineEmits(['update:modelValue'])

const actions = {
  onUpload(option: any) {
    option.onSuccess(option.fileItem)
    dataSource.value.push(option.fileItem)
    emit('update:modelValue', dataSource.value)
  },
  onRemove(fileItem: any) {
    dataSource.value = dataSource.value.filter(
      ({ uid }: any) => uid !== fileItem.uid
    )
    emit('update:modelValue', dataSource.value)
  },
}

watch(
  () => props.list,
  () => {
    if (!props.list) return void 0
    dataSource.value = props.list?.map((item: any) => ({
      uid: item.id ?? uniqueId(),
      name: item.name ?? '',
      status: 'done',
      url: item.url ?? '',
      response: item.file ?? '',
      file: item.file,
    }))
    emit('update:modelValue', dataSource.value)
  },
  {
    immediate: true,
    deep: true,
  }
)
</script>
