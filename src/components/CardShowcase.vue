<script setup lang="ts">
import Card from '@/components/Card.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const card_code = `<KpCard title="节点信息" color="cyan" shadow>
  系统运行正常,数据流稳定。
  <template #extra>
    <button>详情</button>
  </template>
  <template #footer>
    <button>操作</button>
  </template>
</KpCard>`

const card_props: Record<string, string>[] = [
  { prop: 'title', desc: '标题', type: 'String', default: "''", options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'bordered', desc: '显示边框', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'shadow', desc: '霓虹发光阴影', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'hoverable', desc: '悬浮上浮效果', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'padding', desc: '内容区内边距', type: 'Number / String', default: '16', options: '-' }
]
const card_slots: Record<string, string>[] = [
  { name: 'default', desc: '内容区' },
  { name: 'title', desc: '自定义标题(覆盖 title)' },
  { name: 'extra', desc: '标题栏右侧操作区' },
  { name: 'footer', desc: '底部区域' }
]
const card_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">卡片 / CARD</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">基础</span>
        <div class="kp-card-grid">
          <Card title="节点信息" color="cyan">
            <p>&gt; 节点:NIGHT_CITY_07</p>
            <p>&gt; 状态:在线</p>
            <p>&gt; 延迟:0.3ms</p>
          </Card>
          <Card title="能量储备" color="green" shadow>
            <p>&gt; 主能源:87%</p>
            <p>&gt; 备用:满</p>
            <p>&gt; 输出:稳定</p>
          </Card>
        </div>
      </div>

      <div>
        <span class="kp-label">悬浮</span>
        <div class="kp-card-grid">
          <Card title="悬停我" color="magenta" hoverable>
            <p>&gt; 悬浮上浮 + 发光</p>
            <p>&gt; 四角准星显现</p>
          </Card>
          <Card title="阴影卡片" color="yellow" shadow hoverable>
            <p>&gt; 阴影 + 悬浮组合</p>
            <p>&gt; 鼠标移入查看效果</p>
          </Card>
        </div>
      </div>

      <div>
        <span class="kp-label">操作区</span>
        <div class="kp-card-grid">
          <Card title="任务队列" color="cyan">
            <p>&gt; 当前任务:3 个进行中</p>
            <template #extra>
              <button class="kp-card-btn">刷新</button>
            </template>
            <template #footer>
              <div class="kp-card-footer">
                <button class="kp-card-btn">查看全部</button>
                <button class="kp-card-btn kp-card-btn--ghost">清空</button>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-card-grid kp-card-grid--4">
          <Card title="青" color="cyan" shadow><p style="text-align:center">CYAN</p></Card>
          <Card title="品" color="magenta" shadow><p style="text-align:center">MAGENTA</p></Card>
          <Card title="绿" color="green" shadow><p style="text-align:center">GREEN</p></Card>
          <Card title="黄" color="yellow" shadow><p style="text-align:center">YELLOW</p></Card>
        </div>
      </div>
    </div>

    <CodeBlock :code="card_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="card_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="card_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="card_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-md);
}
.kp-card-grid--4 {
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
}

.kp-card-btn {
  padding: 4px 12px;
  border: 1px solid var(--neon-cyan);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-card-btn:hover { background: rgba(0, 240, 255, 0.12); }
.kp-card-btn--ghost {
  border-color: var(--border-bright);
  color: var(--text-secondary);
}
.kp-card-btn--ghost:hover { border-color: var(--text-secondary); background: transparent; }

.kp-card-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
}
</style>
