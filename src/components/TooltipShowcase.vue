<script setup lang="ts">
import Tooltip from '@/components/Tooltip.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const tooltip_code = `<!-- hover 触发,上方 -->
<KpTooltip content="提示文字" placement="top">
  <button>悬停我</button>
</KpTooltip>

<!-- click 触发 -->
<KpTooltip content="点击触发" trigger="click" placement="bottom">
  <button>点击我</button>
</KpTooltip>

<!-- 自定义内容插槽 -->
<KpTooltip placement="right" color="green">
  <button>查看详情</button>
  <template #content>
    <span style="color: var(--neon-green)">● 在线</span> 系统正常
  </template>
</KpTooltip>`

const tooltip_props: Record<string, string>[] = [
  { prop: 'content', desc: '提示文字', type: 'String', default: "''", options: '-' },
  { prop: 'placement', desc: '弹出方位', type: 'String', default: 'top', options: 'top / bottom / left / right' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'trigger', desc: '触发方式', type: 'String', default: 'hover', options: 'hover / click' },
  { prop: 'show_arrow', desc: '显示箭头', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' }
]
const tooltip_slots: Record<string, string>[] = [
  { name: 'default', desc: '触发元素' },
  { name: 'content', desc: '自定义气泡内容(覆盖 content)' }
]
const tooltip_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">文字提示 / TOOLTIP</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">方向</span>
        <div class="kp-tooltip-grid">
          <Tooltip content="上方提示" placement="top"><span class="kp-tooltip-btn">TOP</span></Tooltip>
          <Tooltip content="下方提示" placement="bottom"><span class="kp-tooltip-btn">BOTTOM</span></Tooltip>
          <Tooltip content="左侧提示" placement="left"><span class="kp-tooltip-btn">LEFT</span></Tooltip>
          <Tooltip content="右侧提示" placement="right"><span class="kp-tooltip-btn">RIGHT</span></Tooltip>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-tooltip-grid">
          <Tooltip content="CYAN" placement="top" color="cyan"><span class="kp-tooltip-btn">青</span></Tooltip>
          <Tooltip content="MAGENTA" placement="top" color="magenta"><span class="kp-tooltip-btn">品</span></Tooltip>
          <Tooltip content="GREEN" placement="top" color="green"><span class="kp-tooltip-btn">绿</span></Tooltip>
          <Tooltip content="YELLOW" placement="top" color="yellow"><span class="kp-tooltip-btn">黄</span></Tooltip>
        </div>
      </div>

      <div>
        <span class="kp-label">触发</span>
        <div class="kp-tooltip-grid">
          <Tooltip content="鼠标悬停触发" placement="top" trigger="hover"><span class="kp-tooltip-btn">HOVER</span></Tooltip>
          <Tooltip content="点击触发,点外部关闭" placement="top" trigger="click"><span class="kp-tooltip-btn">CLICK</span></Tooltip>
        </div>
      </div>

      <div>
        <span class="kp-label">自定义</span>
        <div class="kp-tooltip-grid">
          <Tooltip placement="right" color="green">
            <span class="kp-tooltip-btn">详情</span>
            <template #content>
              <span class="kp-tooltip-rich"><b style="color: var(--neon-green)">● 在线</b> 系统运行正常</span>
            </template>
          </Tooltip>
          <Tooltip content="无箭头" placement="top" :show_arrow="false" color="magenta"><span class="kp-tooltip-btn">无箭头</span></Tooltip>
          <Tooltip content="已禁用" placement="top" disabled><span class="kp-tooltip-btn">禁用</span></Tooltip>
        </div>
      </div>
    </div>

    <CodeBlock :code="tooltip_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="tooltip_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="tooltip_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="tooltip_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-tooltip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  align-items: center;
}

.kp-tooltip-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 14px;
  border: 1px solid var(--border-bright);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--text-secondary);
  font-size: 12px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-tooltip-btn:hover {
  border-color: var(--neon-cyan);
  color: var(--neon-cyan);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
}

.kp-tooltip-rich {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
