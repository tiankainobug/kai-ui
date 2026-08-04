<script setup lang="ts">
import { ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 标签数据
const line_tabs = [
  { label: '概览', name: 'overview' },
  { label: '日志', name: 'log' },
  { label: '配置', name: 'config' },
  { label: '禁用项', name: 'locked', disabled: true }
]
const card_tabs = [
  { label: 'NEURAL', name: 'neural' },
  { label: 'CAMO', name: 'camo' },
  { label: 'HACK', name: 'hack' }
]

const active_line = ref('overview')
const active_card = ref('neural')
const active_color = ref('overview')
const color_tabs = [
  { label: '青', name: 'overview' },
  { label: '品', name: 'log' },
  { label: '绿', name: 'config' }
]

const tabs_code = `<KpTabs v-model="active" :tabs="tabs" type="line" color="cyan">
  <template #panel-overview>概览内容</template>
  <template #panel-log>日志内容</template>
</KpTabs>

<!-- 卡片风格 -->
<KpTabs v-model="active" :tabs="tabs" type="card" color="green" />`

const tabs_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '激活项 name(配合 v-model)', type: 'String', default: "''", options: '-' },
  { prop: 'tabs', desc: '标签数据', type: 'Array<{ label, name, disabled? }>', default: '[]', options: '-' },
  { prop: 'type', desc: '风格', type: 'String', default: 'line', options: 'line / card' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' }
]
const tabs_slots: Record<string, string>[] = [
  { name: 'panel-{name}', desc: '对应标签的内容插槽(name 为标签 name)' },
  { name: 'default', desc: '无匹配插槽时的兜底内容' }
]
const tabs_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '激活项变化(配合 v-model)', param: '(value: String)' },
  { name: 'change', desc: '切换标签时触发', param: '(value: String)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">标签页 / TABS</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">线条</span>
        <div class="kp-tabs-wrap">
          <Tabs v-model="active_line" :tabs="line_tabs" type="line" color="cyan">
            <template #panel-overview>
              <p>&gt; 系统概览:所有节点在线,数据流稳定。</p>
            </template>
            <template #panel-log>
              <p>&gt; [23:47] 建立连接</p>
              <p>&gt; [23:48] 同步完成</p>
              <p>&gt; [23:49] ICE 追踪已规避</p>
            </template>
            <template #panel-config>
              <p>&gt; 带宽上限:1.2 Tbps</p>
              <p>&gt; 加密层级:AES-512</p>
            </template>
          </Tabs>
        </div>
      </div>

      <div>
        <span class="kp-label">卡片</span>
        <div class="kp-tabs-wrap">
          <Tabs v-model="active_card" :tabs="card_tabs" type="card" color="green">
            <template #panel-neural><p>&gt; 神经接口:已校准,延迟 0.3ms</p></template>
            <template #panel-camo><p>&gt; 光学迷彩:可用时长 42min</p></template>
            <template #panel-hack><p>&gt; 黑客模块:入侵协议已加载</p></template>
          </Tabs>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-tabs-wrap">
          <Tabs v-model="active_color" :tabs="color_tabs" type="line" color="magenta">
            <template #panel-overview><p>&gt; 品红主题</p></template>
            <template #panel-log><p>&gt; 品红日志</p></template>
            <template #panel-config><p>&gt; 品红配置</p></template>
          </Tabs>
        </div>
      </div>

      <div>
        <span class="kp-label">交互</span>
        <div class="kp-tabs-echo">
          <p class="preview__echo">&gt; 线条激活:{{ active_line }}</p>
          <p class="preview__echo">&gt; 卡片激活:{{ active_card }}</p>
          <p class="preview__echo">&gt; 提示:第四项 "禁用项" 不可点击</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="tabs_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="tabs_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="tabs_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="tabs_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-tabs-wrap {
  width: 100%;
}

.kp-tabs-echo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
