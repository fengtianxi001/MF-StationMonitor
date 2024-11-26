import { Message as ArcoMessage } from '@arco-design/web-vue'
import { isFunction } from 'lodash'
import { isString } from 'lodash'

let MessageMap = new Map()

export const message: any = {
  clear: () => ArcoMessage.clear(),
}
const messageKeys = ['info', 'success', 'warning', 'error', 'loading', 'normal']

messageKeys.forEach((key) => {
  message[key] = (config: any) => {
    const mapKey = isString(config)
      ? `${key}/${config}`
      : `${key}/${config.content}`
    if (MessageMap.has(mapKey)) return void 0
    const onClose = () => {
      isFunction(config.onClose) && config.onClose()
      MessageMap.delete(mapKey)
    }
    const _config = isString(config)
      ? { content: config, onClose }
      : { ...config, onClose }
    const instance = ArcoMessage[key](_config)
    MessageMap.set(mapKey, instance)
  }
})
