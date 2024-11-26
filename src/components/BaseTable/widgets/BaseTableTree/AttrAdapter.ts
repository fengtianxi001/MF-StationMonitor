import { cloneDeep, filter } from 'lodash'

export class AttrAdapter {
  static tableProps(
    columns: any[],
    selection: 'checkbox' | 'radio' | undefined
  ) {
    const defaultProps: any = {
      bordered: {
        wrapper: true,
        cell: true,
        bodyCell: true,
      },
      rowKey: 'id',
      tableLayoutFixed: true,
      pagination: false,
    }
    //处理选择器
    if (selection === 'checkbox') {
      defaultProps.rowSelection = {
        type: 'checkbox',
        showCheckedAll: true,
        onlyCurrent: true,
        fixed: true,
      }
    } else if (selection === 'radio') {
      defaultProps.rowSelection = {
        type: 'radio',
        onlyCurrent: true,
        fixed: true,
      }
    }
    //处理columns
    defaultProps.columns = filter(
      cloneDeep(columns),
      (column) => column.show !== false
    )
    return defaultProps
  }
}
export default AttrAdapter
