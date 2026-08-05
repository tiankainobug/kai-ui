<script setup lang="ts">
import Notification from '@/components/Notification.vue'
import { notification } from '@/components/notification'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const show_info = () => notification.info({ title: '系统通知', content: '检测到新版本固件,建议更新。' })
const show_success = () => notification.success({ title: '操作成功', content: '神经接口校准完成,延迟 0.3ms。' })
const show_warning = () => notification.warning({ title: '安全警告', content: 'ICE 追踪信号增强,请立即撤离。' })
const show_error = () => notification.error({ title: '连接错误', content: '主节点失联,已切换备用通道。' })
const show_persist = () => notification.warning({ title: '需手动关闭', content: 'duration=0 不自动消失。', duration: 0 })

const notification_code = `import { notification } from '@/components/notification'
import Notification from '@/components/Notification.vue'

// 挂载一次容器
< Notification />

// 命令式调用
notification.info({ title: '标题', content: '内容' })
notification.success({ title: '成功', duration: 5000 })
notification.warning({ title: '警告', duration: 0 }) // 不自动关闭`

const notification_methods: Record<string, string>[] = [
  { prop: 'notification.info', desc: '信息通知', type: '(opts)', default: '-', options: '-' },
  { prop: 'notification.success', desc: '成功通知', type: '(opts)', default: '-', options: '-' },
  { prop: 'notification.warning', desc: '警告通知', type: '(opts)', default: '-', options: '-' },
  { prop: 'notification.error', desc: '错误通知', type: '(opts)', default: '-', options: '-' },
  { prop: 'notification.remove', desc: '手动移除(id)', type: '(id: Number)', default: '-', options: '-' }
]
const notification_opts: Record<string, string>[] = [
  { prop: 'opts.title', desc: '标题', type: 'String', default: '-', options: '-' },
  { prop: 'opts.content', desc: '内容', type: 'String', default: '-', options: '-' },
  { prop: 'opts.duration', desc: '自动关闭时长(ms)', type: 'Number', default: '4500', options: '0=不关闭' }
]
const notification_slots: Record<string, string>[] = [
  { name: '-', desc: '无插槽(命令式 API)' }
]
const notification_events: Record<string, string>[] = [
  { name: '-', desc: '无事件(命令式 API)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">通知 / NOTIFICATION</h2>

    <!-- 全局通知容器 -->
    <Notification />

    <div class="kp-demo">
      <div>
        <span class="kp-label">类型</span>
        <div class="kp-row">
          <button class="kp-noti-btn kp-noti-btn--cyan" @click="show_info">INFO</button>
          <button class="kp-noti-btn kp-noti-btn--green" @click="show_success">SUCCESS</button>
          <button class="kp-noti-btn kp-noti-btn--yellow" @click="show_warning">WARNING</button>
          <button class="kp-noti-btn kp-noti-btn--red" @click="show_error">ERROR</button>
        </div>
      </div>

      <div>
        <span class="kp-label">时长</span>
        <div class="kp-row">
          <button class="kp-noti-btn kp-noti-btn--cyan" @click="notification.info({ title: '默认 4.5s', content: '自动关闭' })">默认</button>
          <button class="kp-noti-btn kp-noti-btn--green" @click="notification.success({ title: '8 秒关闭', duration: 8000 })">8s</button>
          <button class="kp-noti-btn kp-noti-btn--yellow" @click="show_persist">不自动关闭</button>
        </div>
      </div>

      <div>
        <span class="kp-label">说明</span>
        <div class="kp-noti-note">
          <p>&gt; 通知从屏幕右上角滑入,自动堆叠;</p>
          <p>&gt; 标题 + 内容双层结构,比 Message 更丰富;</p>
          <p>&gt; 到时自动消失,或点击 × 提前关闭。</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="notification_code" />

    <div class="preview__api">
      <ApiTable title="方法 API" :columns="props_columns" :rows="notification_methods" />
      <ApiTable title="opts 参数" :columns="props_columns" :rows="notification_opts" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="notification_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="notification_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-noti-btn {
  padding: 8px 18px;
  border: 1px solid var(--kp-c);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--kp-c);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-noti-btn:hover { box-shadow: 0 0 8px var(--kp-c); }
.kp-noti-btn--cyan { --kp-c: var(--neon-cyan); }
.kp-noti-btn--green { --kp-c: var(--neon-green); }
.kp-noti-btn--yellow { --kp-c: var(--neon-yellow); }
.kp-noti-btn--red { --kp-c: var(--neon-red); }

.kp-noti-note {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}
</style>
