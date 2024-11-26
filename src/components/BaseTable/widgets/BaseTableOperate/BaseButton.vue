<template>
  <Button :loading="loading" v-bind="{ ...attrs }">
    <template #icon v-if="attrs.icon">
      <component :is="generateIcon(attrs)" />
    </template>
    <template #default>
      {{ config.text }}
    </template>
  </Button>
</template>
<script setup lang="tsx">
import { Button } from '@arco-design/web-vue'
import { computed, ref } from 'vue'
import { useCatchAsync } from '../../hooks/useCatchAsync'
import * as Icons from '@arco-design/web-vue/es/icon'

interface PropsType {
  config: any
}

const props = defineProps<PropsType>()

const loading = ref(false)

const generateIcon = (attrs: any) => {
  const iconList: any = { ...Icons }
  if (attrs.icon && iconList[attrs.icon]) {
    return iconList[attrs.icon]
  } else {
    return <span></span>
  }
}

const attrs = computed(() => {
  const temp: any = { ...props.config }
  temp.onClick = async () => {
    loading.value = true
    await useCatchAsync(props.config.onClick())
    loading.value = false
  }
  return temp
})
</script>
