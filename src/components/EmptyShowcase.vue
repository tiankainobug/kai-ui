<script setup lang="ts">
import Empty from '@/components/Empty.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const empty_code = `<KpEmpty description="暂无数据" />

<!-- 指定插图 -->
<KpEmpty image="network" description="网络连接失败" />

<!-- 自定义操作 -->
<KpEmpty description="列表为空">
  <template #action>
    <button>重新加载</button>
  </template>
</KpEmpty>`

const empty_props: Record<string, string>[] = [
  { prop: 'description', desc: '描述文字', type: 'String', default: '暂无数据', options: '-' },
  { prop: 'image', desc: '插图预设', type: 'String', default: 'default', options: 'default / network / search / lock' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow / red' }
]
const empty_slots: Record<string, string>[] = [
  { name: 'default', desc: '描述内容(覆盖 description)' },
  { name: 'image', desc: '自定义插图(覆盖 image 预设)' },
  { name: 'action', desc: '底部操作区(如重试按钮)' }
]
const empty_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">空状态 / EMPTY</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">预设</span>
        <div class="kp-empty-grid">
          <div class="kp-empty-box"><Empty image="default" description="暂无数据" /></div>
          <div class="kp-empty-box"><Empty image="network" description="网络断开" color="magenta" /></div>
          <div class="kp-empty-box"><Empty image="search" description="未找到结果" color="yellow" /></div>
          <div class="kp-empty-box"><Empty image="lock" description="无访问权限" color="red" /></div>
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-empty-grid">
          <div class="kp-empty-box kp-empty-box--sm"><Empty size="sm" description="SMALL" /></div>
          <div class="kp-empty-box"><Empty size="md" description="MEDIUM" /></div>
          <div class="kp-empty-box kp-empty-box--lg"><Empty size="lg" description="LARGE" /></div>
        </div>
      </div>

      <div>
        <span class="kp-label">操作</span>
        <div class="kp-empty-grid">
          <div class="kp-empty-box">
            <Empty description="数据加载失败,请重试">
              <template #action>
                <button class="kp-empty-btn">重新加载</button>
              </template>
            </Empty>
          </div>
          <div class="kp-empty-box">
            <Empty image="search" description="没有匹配的节点">
              <template #action>
                <button class="kp-empty-btn kp-empty-btn--ghost">清除筛选</button>
              </template>
            </Empty>
          </div>
        </div>
      </div>

      <div>
        <span class="kp-label">自定义</span>
        <div class="kp-empty-grid">
          <div class="kp-empty-box">
            <Empty>
              <template #image>
                <div class="kp-empty-custom-icon">404</div>
              </template>
              自定义插图 + 文案
            </Empty>
          </div>
        </div>
      </div>
    </div>

    <CodeBlock :code="empty_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="empty_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="empty_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="empty_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-empty-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-md);
}

.kp-empty-box {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-panel);
  overflow: hidden;
}
.kp-empty-box--sm { min-height: 140px; }
.kp-empty-box--lg { min-height: 220px; }

.kp-empty-btn {
  padding: 6px 16px;
  border: 1px solid var(--neon-cyan);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-empty-btn:hover { background: rgba(0, 240, 255, 0.12); box-shadow: 0 0 8px rgba(0, 240, 255, 0.4); }
.kp-empty-btn--ghost { border-color: var(--border-bright); color: var(--text-secondary); }
.kp-empty-btn--ghost:hover { background: transparent; border-color: var(--text-secondary); }

.kp-empty-custom-icon {
  font-size: 36px;
  font-weight: 700;
  color: var(--neon-cyan);
  text-shadow: 0 0 10px var(--neon-cyan);
  letter-spacing: 2px;
}
</style>
