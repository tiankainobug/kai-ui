<script setup lang="ts">
import Divider from '@/components/Divider.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const divider_code = `<!-- 横向 -->
<KpDivider color="cyan" />

<!-- 带文字 -->
<KpDivider text="详情" color="green" />

<!-- 虚线 -->
<KpDivider dashed color="magenta" />

<!-- 纵向 -->
<div style="display:flex;gap:8px">
  <span>A</span>
  <KpDivider direction="vertical" />
  <span>B</span>
</div>`

const divider_props: Record<string, string>[] = [
  { prop: 'direction', desc: '方向', type: 'String', default: 'horizontal', options: 'horizontal / vertical' },
  { prop: 'align', desc: '文字对齐', type: 'String', default: 'center', options: 'left / center / right' },
  { prop: 'text', desc: '文字', type: 'String', default: "''", options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'dashed', desc: '虚线', type: 'Boolean', default: 'false', options: '-' }
]
const divider_slots: Record<string, string>[] = [
  { name: 'default', desc: '文字内容(覆盖 text)' }
]
const divider_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">分割线 / DIVIDER</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">横向</span>
        <div class="kp-divider-demo">
          <p class="kp-divider-text-line">数据流</p>
          <Divider color="cyan" />
          <p class="kp-divider-text-line">能量流</p>
        </div>
      </div>

      <div>
        <span class="kp-label">文字</span>
        <div class="kp-divider-demo">
          <Divider text="概览" color="green" align="center" />
          <Divider text="详情" color="magenta" align="left" />
          <Divider text="操作" color="yellow" align="right" />
        </div>
      </div>

      <div>
        <span class="kp-label">虚线</span>
        <div class="kp-divider-demo">
          <Divider dashed color="cyan" />
          <Divider dashed text="分段" color="magenta" />
        </div>
      </div>

      <div>
        <span class="kp-label">纵向</span>
        <div class="kp-divider-vertical-demo">
          <span>节点 A</span>
          <Divider direction="vertical" color="cyan" />
          <span>节点 B</span>
          <Divider direction="vertical" color="green" />
          <span>节点 C</span>
          <Divider direction="vertical" color="magenta" />
          <span>节点 D</span>
        </div>
      </div>

      <div>
        <span class="kp-label">纵向虚线</span>
        <div class="kp-divider-vertical-demo">
          <span>A</span>
          <Divider direction="vertical" dashed color="yellow" />
          <span>B</span>
          <Divider direction="vertical" dashed color="cyan" />
          <span>C</span>
        </div>
      </div>
    </div>

    <CodeBlock :code="divider_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="divider_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="divider_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="divider_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-divider-demo {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.kp-divider-text-line {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
  padding-left: var(--space-sm);
}

.kp-divider-vertical-demo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
