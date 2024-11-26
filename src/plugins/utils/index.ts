import dayjs from 'dayjs'
import { createVNode, defineComponent, h, render } from 'vue'
import { Modal, Message } from '@arco-design/web-vue'
import { isFunction } from 'lodash'
/**
 * 对promise进行包装,方便进行错误捕获
 */
export function mockResponse<T>(data: T) {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), 500)
  })
}

/**
 * 对promise进行包装,方便进行错误捕获
 */
export function catchAsync(promise: Promise<any>) {
  return Promise.resolve(promise)
    .then((data) => ({ data, error: null, success: true }))
    .catch((error) => ({ data: null, error, success: false }))
}

/**
 * 对await操作进行延时包装,方便进行加载动画
 * - component: `VUE`组件
 * - props: 需要传入组件的属性
 */
export async function awaitWithDelay(promise: any, time = 500) {
  const start = new Date().getTime()
  await promise
  const end = new Date().getTime()
  const diff = end - start
  const delay = (time: number) => {
    new Promise((resolve) => setTimeout(resolve, time))
  }
  if (diff < time) await delay(time - diff)
}

/**
 * 实例化Vue组件
 * - component: `VUE`组件
 * - props: 需要传入组件的属性
 */
export function instantiateVueComponent(component: any, props: any) {
  const newComponent = defineComponent({ render: () => h(component, props) })
  const instance = createVNode(newComponent)
  render(instance, document.createElement('div'))
  return instance.el as HTMLElement
}

/**
 * 格式化日期
 * - date: 日期,可以是`Date`对象、时间戳、字符串、`dayjs`对象
 * - format: [时间解析占位符](https://dayjs.gitee.io/docs/zh-CN/parse/string-format),默认为`YYYY-MM-DD HH:mm:ss`
 */
export function formatDate(date: any, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).isValid() ? dayjs(date).format(format) : ''
}

export function confirmbox(title: string, callback?: Function) {
  return new Promise((resolve) => {
    Modal.confirm({
      width: 240,
      title,
      content: `确认${title}吗？`,
      alignCenter: true,
      simple: true,
      modalStyle: {
        textAlign: 'center',
        padding: '20px',
      },
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
      onBeforeOk: async () => {
        if (isFunction(callback)) {
          await awaitWithDelay(callback())
          Message.success(`${title}成功`)
        }
      },
    })
  })
}

export function downloadBlob(blob: any, fileName: string) {
  let tempBlob = new Blob([blob], { type: 'application/json' })
  let reader = new FileReader()
  reader.onload = (e: any) => {
    let url = URL.createObjectURL(new Blob([blob]))
    let aLink = document.createElement('a')
    aLink.download = fileName // 下载文件的名字
    aLink.href = url
    aLink.click()
    URL.revokeObjectURL(url) // 释放内存
  }
  reader.readAsText(tempBlob)
}

export function getQueryString() {
  const queryString = location.href.split('?')?.[1]
  if (!queryString) return {}
  const result: any = {}
  queryString.split('&').forEach((item) => {
    const [key, value] = item.split('=')
    result[key] = value
  })
  return result
}
