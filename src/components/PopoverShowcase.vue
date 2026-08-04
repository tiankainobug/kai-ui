<script setup lang="ts">
import Popover from '@/components/Popover.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const popover_code = `<KpPopover title="系统信息" content="节点运行正常" trigger="click" placement="top">
  <button>点击查看</button>
</KpPopover>

<!-- hover 触发 + 自定义内容 -->
<KpPopover title="详情" trigger="hover" placement="right" color="green">
  <button>悬停查看</button>
  <template #content>
    <div>自定义内容</div>
  </template>
</KpPopover>`

const popover_props: Record<string, string>[] = [
  { prop: 'title', desc: '标题', type: 'String', default: "''", options: '-' },
  { prop: 'content', desc: '内容文字', type: 'String', default: "''", options: '-' },
  { prop: 'trigger', desc: '触发方式', type: 'String', default: 'click', options: 'hover / click' },
  { prop: 'placement', desc: '弹出方位', type: 'String', default: 'top', options: 'top / bottom / left / right' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'width', desc: '面板宽度', type: 'Number / String', default: '220', options: '-' },
  { prop: 'show_arrow', desc: '显示箭头', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' }
]
const popover_slots: Record<string, string>[] = [
  { name: 'default', desc: '触发元素' },
  { name: 'title', desc: '自定义标题(覆盖 title)' },
  { name: 'content', desc: '自定义内容(覆盖 content)' }
]
const popover_events: Record<string, string>[] = [
  { name: 'visible-change', desc: '显隐变化时触发', param: '(value: Boolean)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">气泡卡片 / POPOVER</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">触发</span>
        <div class="kp-popover-grid">
          <Popover title="点击触发" content="点击外部可关闭此气泡" trigger="click" placement="top">
            <span class="kp-popover-btn">CLICK</span>
          </Popover>
          <Popover title="悬停触发" content="鼠标移出即关闭" trigger="hover" placement="top" color="green">
            <span class="kp-popover-btn">HOVER</span>
          </Popover>
        </div>
      </div>

      <div>
        <span class="kp-label">方向</span>
        <div class="kp-popover-grid">
          <Popover title="上方" content="placement=top" placement="top"><span class="kp-popover-btn">TOP</span></Popover>
          <Popover title="下方" content="placement=bottom" placement="bottom"><span class="kp-popover-btn">BOTTOM</span></Popover>
          <Popover title="左侧" content="placement=left" placement="left"><span class="kp-popover-btn">LEFT</span></Popover>
          <Popover title="右侧" content="placement=right" placement="right"><span class="kp-popover-btn">RIGHT</span></Popover>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-popover-grid">
          <Popover title="青" content="CYAN" color="cyan"><span class="kp-popover-btn">青</span></Popover>
          <Popover title="品" content="MAGENTA" color="magenta"><span class="kp-popover-btn">品</span></Popover>
          <Popover title="绿" content="GREEN" color="green"><span class="kp-popover-btn">绿</span></Popover>
          <Popover title="黄" content="YELLOW" color="yellow"><span class="kp-popover-btn">黄</span></Popover>
        </div>
      </div>

      <div>
        <span class="kp-label">自定义</span>
        <div class="kp-popover-grid">
          <Popover placement="right" :width="240" color="magenta" trigger="click">
            <span class="kp-popover-btn">自定义</span>
            <template #title>
              <span style="color: var(--neon-magenta)">⚠ 节点详情</span>
            </template>
            <template #content>
              <div class="kp-popover-rich">
                <p>> 节点:NIGHT_CITY_07</p>
                <p>> 状态:<span style="color: var(--neon-green)">在线</span></p>
                <p>> 延迟:0.3ms</p>
              </div>
            </template>
          </Popover>
          <Popover content="无标题的内容气泡" placement="top" :show_arrow="false" color="yellow" trigger="hover">
            <span class="kp-popover-btn">无标题/无箭头</span>
          </Popover>
        </div>
      </div>
    </div>

    <CodeBlock :code="popover_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="popover_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="popover_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="popover_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-popover-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  align-items: center;
}

.kp-popover-btn {
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
.kp-popover-btn:hover {
  border-color: var(--neon-cyan);
  color: var(--neon-cyan);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
}

.kp-popover-rich {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
