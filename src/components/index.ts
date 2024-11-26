//公共组件的统一出口

export { default as BasePanel } from './BasePanel/index.vue'
export { default as BaseNumberRise } from './BaseNumberRise/index.vue'
export { default as BaseLoading } from './BaseLoading/index.vue'
export { default as BaseDescriptions } from './BaseDescriptions/index.vue'
export { default as BaseEmpty } from './BaseEmpty/index.vue'
export { default as BaseAvatar } from './BaseAvatar/index.vue'

export {
  BaseTable,
  BaseTableFilter,
  BaseTableOperate,
  BaseTablePagination,
  BaseTablePro,
  BaseTableTree,
  BaseTableSetting,
  useTable,
  useTableMethods,
} from './BaseTable'

export { BaseForm, useBaseForm } from './BaseForm'
export {
  BaseModal,
  BaseModalForm,
  createBaseModal,
  useModalForm,
} from './BaseModal'
