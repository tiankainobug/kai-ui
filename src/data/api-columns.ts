// API 文档表格的共用列定义(Props / Slots / Events 三类)
export const props_columns: { key: string; label: string }[] = [
  { key: 'prop', label: '属性' },
  { key: 'desc', label: '说明' },
  { key: 'type', label: '类型' },
  { key: 'default', label: '默认值' },
  { key: 'options', label: '可选值' }
]

export const slots_columns: { key: string; label: string }[] = [
  { key: 'name', label: '插槽名' },
  { key: 'desc', label: '说明' }
]

export const events_columns: { key: string; label: string }[] = [
  { key: 'name', label: '事件名' },
  { key: 'desc', label: '说明' },
  { key: 'param', label: '参数' }
]
