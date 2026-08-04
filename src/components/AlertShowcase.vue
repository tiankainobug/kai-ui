<script setup lang="ts">
import { ref } from 'vue'
import Alert from '@/components/Alert.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const closed_msg = ref('')

const alert_code = `<KpAlert type="success" title="操作成功" description="数据已同步" />

<!-- 可关闭 -->
<KpAlert type="warning" title="警告" closable @close="onClose" />

<!-- banner 风格 -->
<KpAlert type="error" title="系统错误" banner />`

const alert_props: Record<string, string>[] = [
  { prop: 'type', desc: '类型', type: 'String', default: 'info', options: 'info / success / warning / error' },
  { prop: 'title', desc: '标题', type: 'String', default: "''", options: '-' },
  { prop: 'description', desc: '描述文字', type: 'String', default: "''", options: '-' },
  { prop: 'closable', desc: '可关闭', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'show_icon', desc: '显示图标', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'banner', desc: '无边框 banner 风格', type: 'Boolean', default: 'false', options: '-' }
]
const alert_slots: Record<string, string>[] = [
  { name: 'default', desc: '描述内容(覆盖 description)' },
  { name: 'title', desc: '自定义标题(覆盖 title)' }
]
const alert_events: Record<string, string>[] = [
  { name: 'close', desc: '关闭时触发', param: '-' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">警告提示 / ALERT</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">类型</span>
        <div class="kp-alert-stack">
          <Alert type="info" title="信息提示" description="系统正在后台同步数据流" />
          <Alert type="success" title="操作成功" description="神经接口已成功校准" />
          <Alert type="warning" title="警告" description="检测到 ICE 追踪,建议立即撤离" />
          <Alert type="error" title="错误" description="连接中断:信号被敌方截获" />
        </div>
      </div>

      <div>
        <span class="kp-label">可关闭</span>
        <div class="kp-alert-stack">
          <Alert type="info" title="点击右侧 × 关闭我" closable @close="closed_msg = 'info 已关闭'" />
          <Alert type="success" title="成功消息(可关闭)" closable @close="closed_msg = 'success 已关闭'" />
        </div>
        <p class="preview__echo">&gt; {{ closed_msg || '(尚无关闭操作)' }}</p>
      </div>

      <div>
        <span class="kp-label">Banner</span>
        <div class="kp-alert-stack">
          <Alert type="error" title="系统错误" description="关键节点失联,已启动应急协议" banner />
          <Alert type="warning" title="维护通知" description="将于 03:00 进行系统维护" banner />
        </div>
      </div>

      <div>
        <span class="kp-label">变体</span>
        <div class="kp-alert-stack">
          <Alert type="info" title="无图标" :show_icon="false" />
          <Alert type="success" title="仅标题(无描述)" />
          <Alert type="warning" description="仅描述(无标题)" />
        </div>
      </div>
    </div>

    <CodeBlock :code="alert_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="alert_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="alert_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="alert_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-alert-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.preview__echo {
  margin-top: var(--space-sm);
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
