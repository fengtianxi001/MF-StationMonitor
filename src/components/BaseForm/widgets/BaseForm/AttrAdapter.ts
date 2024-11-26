import * as Arco from '@arco-design/web-vue'
import { forEach, isArray, isNil, isObject, isString } from 'lodash'
import { h } from 'vue'
import PinyinMatch from 'pinyin-match'
import CodeEditor from '../CodeEditor/index.vue'
import RecordEditor from '../RecordEditor/index.vue'
import FileUpload from '../FileUpload/index.vue'
import ImageUpload from '../ImageUpload/index.vue'
import SensorWarnEditor from '../SensorWarnEditor/index.vue'

import { builtInRules } from './BuiltInRules'

const formComponentList: any = {
  ...Arco,
  CodeEditor,
  RecordEditor,
  FileUpload,
  ImageUpload,
  SensorWarnEditor,
}

export class AttrAdapter {
  static formItemProps(config: any) {
    return config.formItemProps || {}
  }

  static formItemStyle(config: any) {
    let style = config.formItemProps?.style || {}
    const gridColumn = isNil(config.span) ? 'span 24' : `span ${config.span}`
    return { ...style, gridColumn }
  }

  static formItemRules(config: any) {
    const rules: any[] = []
    const label = config.label
    if (config.required) {
      const message = `${label}不能为空`
      rules.push({ required: true, message })
    }
    //内置规则处理
    if (isArray(config.rules)) {
      forEach(config.rules, (rule) => {
        if (isString(rule)) {
          if (builtInRules[rule]) {
            rules.push(builtInRules[rule])
          } else {
            return console.warn(`${rule}非表单内置规则`)
          }
        } else {
          rules.push(rule)
        }
      })
    }
    return rules
  }

  static formComponentFilter(config: any) {
    const filter: any = {}
    if (config.component === 'TreeSelect') {
      filter.filterTreeNode = (searchValue: string, nodeData: any) => {
        return PinyinMatch.match(nodeData.title, searchValue)
      }
    }
    if (config.component === 'Select') {
      filter.filterOption = (inputValue: string, option: any) => {
        const labelKey = config.props?.fieldNames?.label ?? 'label'
        return PinyinMatch.match(option[labelKey], inputValue)
      }
    }
    return filter
  }

  static formComponent(config: any) {
    if (isObject(config.component)) return config.component
    if (isString(config.component)) {
      if (formComponentList[config.component]) {
        return formComponentList[config.component]
      }
    }
    return h('span', '未知组件')
  }

  static formComponentPlaceholder(config: any) {
    if (config.props?.placeholder) return config.props.placeholder
    if (isObject(config.component)) return ''
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
  }

  static formComponentProps(config: any) {
    //
    return { ...(config.props || {}), style: { width: '100%' } }
  }
}
export default AttrAdapter
