import { reactive } from 'vue'

// 全局通知队列:模块级单例,右上角堆叠
export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export interface NotificationItem {
  id: number
  type: NotificationType
  title: string
  content?: string
  duration: number
}

export const notification_list = reactive<NotificationItem[]>([])

let seed = 0

export const remove_notification = (id: number) => {
  const idx = notification_list.findIndex(n => n.id === id)
  if (idx > -1) notification_list.splice(idx, 1)
}

// 推入通知,duration<=0 不自动关闭(默认 4.5s)
const push_notification = (
  type: NotificationType,
  title: string,
  content?: string,
  duration = 4500
) => {
  const id = ++seed
  notification_list.push({ id, type, title, content, duration })
  if (duration > 0) {
    setTimeout(() => remove_notification(id), duration)
  }
}

export interface NotificationOptions {
  title: string
  content?: string
  duration?: number
}

// 命令式 API:notification.info({ title, content }) 或 notification.open({ type, title })
export const notification = {
  open: (type: NotificationType, opts: NotificationOptions) =>
    push_notification(type, opts.title, opts.content, opts.duration),
  info: (opts: NotificationOptions) => push_notification('info', opts.title, opts.content, opts.duration),
  success: (opts: NotificationOptions) => push_notification('success', opts.title, opts.content, opts.duration),
  warning: (opts: NotificationOptions) => push_notification('warning', opts.title, opts.content, opts.duration),
  error: (opts: NotificationOptions) => push_notification('error', opts.title, opts.content, opts.duration),
  remove: remove_notification
}
