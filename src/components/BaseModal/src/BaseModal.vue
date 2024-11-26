<template>
  <Modal
    ok-text="提交"
    cancel-text="取消"
    title-align="center"
    popup-container="#app"
    :width="800"
    :visible="visible"
    :unmount-on-close="true"
    :on-before-ok="onBeforeOk"
    :ok-button-props="{ disabled: loading }"
    @ok="onOk"
    @cancel="onClose"
  >
    <Spin :loading="loading" style="width: 100%">
      <slot></slot>
    </Spin>
  </Modal>
</template>
<script setup lang="ts">
import { Modal, Spin } from '@arco-design/web-vue'
import { isFunction } from 'lodash'
import { useVisible } from '@/hooks/useVisible'

const { visible, hide } = useVisible(true)

interface PropsType {
  onBeforeConfirm?: () => Promise<boolean>
  onConfirm?: () => unknown
  onCancel?: () => void
  resolve?: (value: any) => void
  loading?: boolean
}
const props = defineProps<PropsType>()

const onBeforeOk = async () => {
  const { onBeforeConfirm, resolve } = props
  if (isFunction(onBeforeConfirm)) {
    const result = await onBeforeConfirm()
    if (result === false) return false
  }
  resolve?.(true)
  return true
}

const onOk = async () => {
  const { onConfirm, resolve } = props
  if (isFunction(onConfirm)) {
    const result = await onConfirm()
    if (result !== false) {
      resolve?.(true)
      hide()
    }
  } else {
    hide()
    resolve?.(true)
  }
}

const onClose = () => {
  const { onCancel, resolve } = props
  isFunction(onCancel) && onCancel()
  isFunction(resolve) && resolve(false)
  hide()
}
</script>
