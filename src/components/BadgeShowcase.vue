<script setup lang="ts">
import { ref } from 'vue'
import Badge from '@/components/Badge.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 交互:模拟消息数动态变化
const msg_count = ref(5)
const add_msg = () => { msg_count.value += 7 }

const badge_code = `<!-- 包裹内容:角标定位右上角 -->
<KpBadge :value="9" color="red">
  <div class="icon">消息</div>
</KpBadge>

<!-- 溢出省略 -->
<KpBadge :value="200" :max="99" color="magenta">通知</KpBadge>

<!-- 点状 -->
<KpBadge is-dot color="green">在线</KpBadge>`

const badge_props: Record<string, string>[] = [
  { prop: 'value', desc: '显示值', type: 'Number / String', default: "''", options: '-' },
  { prop: 'max', desc: '最大值,超出显示 max+', type: 'Number', default: '99', options: '-' },
  { prop: 'is_dot', desc: '仅显示圆点', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'hidden', desc: '隐藏徽标', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'red', options: 'cyan / magenta / green / yellow / red' },
  { prop: 'offset', desc: '偏移量 [x, y] px', type: '[Number, Number]', default: '[0, 0]', options: '-' }
]
const badge_slots: Record<string, string>[] = [
  { name: 'default', desc: '包裹的内容(无则徽标内联展示)' }
]
const badge_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件(纯展示组件)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">徽标 / BADGE</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">数字</span>
        <div class="kp-row kp-badge-row">
          <Badge :value="1" color="red"><div class="kp-badge-box">MSG</div></Badge>
          <Badge :value="9" color="cyan"><div class="kp-badge-box">MAIL</div></Badge>
          <Badge :value="23" color="magenta"><div class="kp-badge-box">BELL</div></Badge>
        </div>
      </div>

      <div>
        <span class="kp-label">溢出</span>
        <div class="kp-row kp-badge-row">
          <Badge :value="99" color="red"><div class="kp-badge-box">99</div></Badge>
          <Badge :value="100" :max="99" color="red"><div class="kp-badge-box">100</div></Badge>
          <Badge :value="999" :max="99" color="magenta"><div class="kp-badge-box">999</div></Badge>
        </div>
      </div>

      <div>
        <span class="kp-label">点状</span>
        <div class="kp-row kp-badge-row">
          <Badge is_dot color="cyan"><div class="kp-badge-box">A</div></Badge>
          <Badge is_dot color="green"><div class="kp-badge-box">B</div></Badge>
          <Badge is_dot color="yellow"><div class="kp-badge-box">C</div></Badge>
          <Badge is_dot color="red"><div class="kp-badge-box">D</div></Badge>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-row">
          <Badge :value="8" color="cyan" />
          <Badge :value="8" color="magenta" />
          <Badge :value="8" color="green" />
          <Badge :value="8" color="yellow" />
          <Badge :value="8" color="red" />
        </div>
      </div>

      <div>
        <span class="kp-label">偏移</span>
        <div class="kp-row kp-badge-row">
          <Badge :value="3" :offset="[6, -6]" color="cyan"><div class="kp-badge-box">默认</div></Badge>
          <Badge :value="3" :offset="[-10, 6]" color="green"><div class="kp-badge-box">左下</div></Badge>
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-row kp-badge-row">
          <Badge :value="5" color="red"><div class="kp-badge-box">显示</div></Badge>
          <Badge :value="5" hidden color="red"><div class="kp-badge-box">隐藏</div></Badge>
        </div>
      </div>

      <div>
        <span class="kp-label">交互</span>
        <div class="kp-badge-row kp-badge-stack">
          <Badge :value="msg_count" :max="99" color="red"><div class="kp-badge-box">消息</div></Badge>
          <button class="kp-badge-btn" @click="add_msg">接收 +7</button>
          <p class="preview__echo">&gt; 未读消息:{{ msg_count > 99 ? '99+' : msg_count }}</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="badge_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="badge_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="badge_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="badge_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-badge-row {
  align-items: center;
  gap: var(--space-lg);
}

.kp-badge-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--border-bright);
  border-radius: var(--radius-md);
  background: var(--bg-elevated);
  color: var(--text-secondary);
  font-size: 11px;
  letter-spacing: 1px;
}

.kp-badge-stack {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.kp-badge-btn {
  padding: 4px 12px;
  border: 1px solid var(--neon-cyan);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-badge-btn:hover {
  background: rgba(0, 240, 255, 0.12);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
