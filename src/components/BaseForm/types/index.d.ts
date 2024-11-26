import type { FieldRule } from '@arco-design/web-vue'
import type { BuiltInRulesType } from '../widgets/BaseForm/BuiltInRules'


type arcoFormComponentType =
  | 'AutoComplete'
  | 'Cascader'
  | 'Checkbox'
  | 'DatePicker'
  | 'MonthPicker'
  | 'YearPicker'
  | 'QuarterPicker'
  | 'WeekPicker'
  | 'RangePicker'
  | 'Input'
  | 'InputSearch'
  | 'InputPassword'
  | 'InputNumber'
  | 'InputTag'
  | 'Mention'
  | 'Radio'
  | 'RadioGroup'
  | 'Rate'
  | 'Select'
  | 'Slider'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'Transfer'
  | 'TreeSelect'
  | 'Upload'

  export type BaseFormConfigType = {
    name: string
    label: string
    component: arcoFormComponentType
    props?: Record<string, any>
    formItemProps?: Record<string, any>
    defaultValue?: any
    disabled?: any
    rules?: Array<FieldRule | BuiltInRulesType>
    required?: boolean
    placeholder?: string | string[]
    visible?: boolean
    clearValueOnHidden?: boolean
    span?: number
    depends?: {
      keys: string[]
      immediate?: boolean
      handler: (...args: any[]) => void | any
    }
  }
  