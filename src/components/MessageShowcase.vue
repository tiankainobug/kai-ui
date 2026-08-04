<script setup lang="ts">
import Message from '@/components/Message.vue'
import { message } from '@/components/message'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 触发各类型消息
const show_info = () => message.info('系统正在同步数据流...')
const show_success = () => message.success('神经接口连接成功', 4000)
const show_warning = () => message.warning('检测到 ICE 追踪,建议撤离')
const show_error = () => message.error('连接中断:信号被黑', 5000)
const show_persist = () => message.warning('这条消息不会自动消失,请手动关闭', 0)

const message_code = `import { message } from '@/components/message'
import Message from '@/components/Message.vue'

// 在根模板挂载一次容器
< Message />

// 命令式调用
message.info('提示文字')
message.success('操作成功', 4000)
message.warning('警告信息')
message.error('错误信息', 5000)
// duration=0 不自动关闭
message.warning('手动关闭', 0)`

const message_methods: Record<string, string>[] = [
  { prop: 'message.info', desc: '信息提示', type: '(text, duration?)', default: '-', options: '-' },
  { prop: 'message.success', desc: '成功提示', type: '(text, duration?)', default: '-', options: '-' },
  { prop: 'message.warning', desc: '警告提示', type: '(text, duration?)', default: '-', options: '-' },
  { prop: 'message.error', desc: '错误提示', type: '(text, duration?)', default: '-', options: '-' },
  { prop: 'message.remove', desc: '手动移除(id)', type: '(id: Number)', default: '-', options: '-' }
]
const message_slots: Record<string, string>[] = [
  { name: '-', desc: '无插槽(命令式 API)' }
]
const message_events: Record<string, string>[] = [
  { name: '-', desc: '无事件(命令式 API)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">消息提示 / MESSAGE</h2>

    <!-- 全局消息容器:挂载一次即可 -->
    <Message />

    <div class="kp-demo">
      <div>
        <span class="kp-label">类型</span>
        <div class="kp-row">
          <button class="kp-msg-btn kp-msg-btn--cyan" @click="show_info">INFO</button>
          <button class="kp-msg-btn kp-msg-btn--green" @click="show_success">SUCCESS</button>
          <button class="kp-msg-btn kp-msg-btn--yellow" @click="show_warning">WARNING</button>
          <button class="kp-msg-btn kp-msg-btn--red" @click="show_error">ERROR</button>
        </div>
      </div>

      <div>
        <span class="kp-label">时长</span>
        <div class="kp-row">
          <button class="kp-msg-btn kp-msg-btn--cyan" @click="message.info('默认 3 秒后消失')">默认 3s</button>
          <button class="kp-msg-btn kp-msg-btn--green" @click="message.success('5 秒后消失', 5000)">5s</button>
          <button class="kp-msg-btn kp-msg-btn--yellow" @click="show_persist">不自动关闭</button>
        </div>
      </div>

      <div>
        <span class="kp-label">说明</span>
        <div class="kp-msg-note">
          <p>&gt; 消息从屏幕顶部居中滑入,自动堆叠;</p>
          <p>&gt; 同一类型可多次触发,逐条展示;</p>
          <p>&gt; 点击右侧 × 可提前关闭。</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="message_code" />

    <div class="preview__api">
      <ApiTable title="方法 API" :columns="props_columns" :rows="message_methods" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="message_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="message_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-msg-btn {
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
.kp-msg-btn:hover { box-shadow: 0 0 8px var(--kp-c); }
.kp-msg-btn--cyan { --kp-c: var(--neon-cyan); }
.kp-msg-btn--green { --kp-c: var(--neon-green); }
.kp-msg-btn--yellow { --kp-c: var(--neon-yellow); }
.kp-msg-btn--red { --kp-c: var(--neon-red); }

.kp-msg-note {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 0.5px;
}
</style>
