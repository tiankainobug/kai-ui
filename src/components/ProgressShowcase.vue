<script setup lang="ts">
import { ref } from 'vue'
import Progress from '@/components/Progress.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 交互回显
const charge = ref(35)
const charge_up = () => { charge.value = Math.min(100, charge.value + 10) }
const reset = () => { charge.value = 0 }

const progress_code = `<KpProgress :model-value="60" color="cyan" />

<!-- 环形 -->
<KpProgress :model-value="80" type="circle" color="green" />

<!-- 条纹动画 -->
<KpProgress :model-value="45" striped color="magenta" />

<!-- 状态 -->
<KpProgress :model-value="100" status="success" />`

const progress_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '百分比(0-100)', type: 'Number', default: '0', options: '-' },
  { prop: 'type', desc: '类型', type: 'String', default: 'line', options: 'line / circle' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'show_text', desc: '显示百分比', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'striped', desc: '条纹流动动画', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'status', desc: '状态(覆盖颜色)', type: 'String', default: 'normal', options: 'normal / success / error' }
]
const progress_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const progress_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件(纯展示组件)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">进度条 / PROGRESS</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">线形</span>
        <div class="kp-progress-stack">
          <Progress :model-value="35" color="cyan" />
          <Progress :model-value="65" color="magenta" />
          <Progress :model-value="90" color="green" />
        </div>
      </div>

      <div>
        <span class="kp-label">环形</span>
        <div class="kp-row kp-progress-circles">
          <Progress :model-value="35" type="circle" color="cyan" />
          <Progress :model-value="65" type="circle" color="magenta" />
          <Progress :model-value="90" type="circle" color="green" />
          <Progress :model-value="100" type="circle" status="success" />
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-progress-stack">
          <Progress :model-value="50" size="sm" />
          <Progress :model-value="50" size="md" />
          <Progress :model-value="50" size="lg" />
        </div>
      </div>

      <div>
        <span class="kp-label">条纹</span>
        <div class="kp-progress-stack">
          <Progress :model-value="45" striped color="magenta" />
          <Progress :model-value="70" striped color="yellow" />
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-progress-stack">
          <Progress :model-value="100" status="success" />
          <Progress :model-value="40" status="error" />
          <Progress :model-value="100" type="circle" status="success" />
          <Progress :model-value="40" type="circle" status="error" />
        </div>
      </div>

      <div>
        <span class="kp-label">交互</span>
        <div class="kp-progress-stack">
          <Progress v-model="charge" :striped="charge < 100" :status="charge >= 100 ? 'success' : 'normal'" color="cyan" />
          <div class="kp-progress-btns">
            <button class="kp-progress-btn" @click="charge_up">充能 +10</button>
            <button class="kp-progress-btn" @click="reset">重置</button>
          </div>
          <p class="preview__echo">&gt; 能量:{{ charge }}%</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="progress_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="progress_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="progress_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="progress_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-progress-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.kp-progress-circles {
  gap: var(--space-lg);
}

.kp-progress-btns {
  display: flex;
  gap: var(--space-sm);
}

.kp-progress-btn {
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
.kp-progress-btn:hover {
  background: rgba(0, 240, 255, 0.12);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
