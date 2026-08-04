import { reactive } from 'vue'

// 全局消息队列:模块级单例,整个应用共享一个 reactive 列表
export type MessageType = 'info' | 'success' | 'warning' | 'error'
export interface MessageItem {
  id: number
  type: MessageType
  text: string
}

export const message_list = reactive<MessageItem[]>([])

let seed = 0

export const remove_message = (id: number) => {
  const idx = message_list.findIndex(m => m.id === id)
  if (idx > -1) message_list.splice(idx, 1)
}

// 推入一条消息,duration<=0 表示不自动关闭
const push_message = (type: MessageType, text: string, duration = 3000) => {
  const id = ++seed
  message_list.push({ id, type, text })
  if (duration > 0) {
    setTimeout(() => remove_message(id), duration)
  }
}

// 命令式 API:在各页面调用 message.success('...') 等
export const message = {
  info: (text: string, duration?: number) => push_message('info', text, duration),
  success: (text: string, duration?: number) => push_message('success', text, duration),
  warning: (text: string, duration?: number) => push_message('warning', text, duration),
  error: (text: string, duration?: number) => push_message('error', text, duration),
  remove: remove_message
}
