<script setup lang="ts">
import { ref } from 'vue'
import Collapse from '@/components/Collapse.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const items = [
  { title: '系统概览', name: 'overview' },
  { title: '网络状态', name: 'network' },
  { title: '安全日志', name: 'log' },
  { title: '禁用项(不可展开)', name: 'locked', disabled: true }
]

const active = ref<string[]>(['overview'])
const accordion_active = ref<string[]>([])

const collapse_code = `<KpCollapse v-model="active" :items="items" color="cyan">
  <template #panel-overview>概览内容</template>
  <template #panel-network>网络内容</template>
</KpCollapse>

<!-- 手风琴:同时只展开一项 -->
<KpCollapse v-model="acc" :items="items" accordion color="green" />`

const collapse_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '展开项 name 数组(配合 v-model)', type: 'String[]', default: '[]', options: '-' },
  { prop: 'items', desc: '面板数据', type: 'Array<{ title, name, disabled? }>', default: '[]', options: '-' },
  { prop: 'accordion', desc: '手风琴模式(仅展开一项)', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' }
]
const collapse_slots: Record<string, string>[] = [
  { name: 'panel-{name}', desc: '对应面板的内容插槽(name 为面板 name)' }
]
const collapse_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '展开项变化(配合 v-model)', param: '(value: String[])' },
  { name: 'change', desc: '切换时触发', param: '(value: String[])' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">折叠面板 / COLLAPSE</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">多面板</span>
        <div class="kp-collapse-wrap">
          <Collapse v-model="active" :items="items" color="cyan">
            <template #panel-overview>
              <p>&gt; 节点:3 个在线</p>
              <p>&gt; 负载:42%</p>
              <p>&gt; 运行时长:7d 14h</p>
            </template>
            <template #panel-network>
              <p>&gt; 带宽:1.2 Tbps</p>
              <p>&gt; 丢包率:0.01%</p>
            </template>
            <template #panel-log>
              <p>&gt; [23:47] 建立连接</p>
              <p>&gt; [23:48] ICE 追踪已规避</p>
            </template>
          </Collapse>
          <p class="preview__echo">&gt; 已展开:{{ active.length ? active.join(', ') : '(无)' }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">手风琴</span>
        <div class="kp-collapse-wrap">
          <Collapse v-model="accordion_active" :items="items" accordion color="green">
            <template #panel-overview><p>&gt; 同时仅展开一项</p></template>
            <template #panel-network><p>&gt; 展开新项会收起旧项</p></template>
            <template #panel-log><p>&gt; 安全日志内容</p></template>
          </Collapse>
          <p class="preview__echo">&gt; 当前展开:{{ accordion_active.length ? accordion_active[0] : '(无)' }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-collapse-wrap">
          <Collapse v-model="active" :items="items" color="magenta">
            <template #panel-overview><p>&gt; 品红主题</p></template>
            <template #panel-network><p>&gt; 网络内容</p></template>
            <template #panel-log><p>&gt; 日志内容</p></template>
          </Collapse>
        </div>
      </div>
    </div>

    <CodeBlock :code="collapse_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="collapse_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="collapse_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="collapse_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-collapse-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
