<script setup lang="ts">
import { ref } from 'vue'
import Steps from '@/components/Steps.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const steps_data = [
  { title: '建立连接', description: '握手协议完成' },
  { title: '身份验证', description: '神经签名校验' },
  { title: '数据同步', description: '传输 2.4TB' },
  { title: '任务完成', description: '断开连接' }
]

const current = ref(1)
const error_current = ref(1)

const next = () => { current.value = Math.min(steps_data.length - 1, current.value + 1) }
const prev = () => { current.value = Math.max(0, current.value - 1) }

const steps_code = `<KpSteps v-model="current" :steps="steps" color="cyan" />

<!-- 纵向 -->
<KpSteps v-model="current" :steps="steps" direction="vertical" color="green" />

<!-- 错误状态 -->
<KpSteps v-model="2" :steps="steps" status="error" />`

const steps_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '当前步骤(从0开始)', type: 'Number', default: '0', options: '-' },
  { prop: 'steps', desc: '步骤数据', type: 'Array<{ title, description?, icon? }>', default: '[]', options: '-' },
  { prop: 'direction', desc: '方向', type: 'String', default: 'horizontal', options: 'horizontal / vertical' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'status', desc: '当前步状态', type: 'String', default: 'process', options: 'process / error' }
]
const steps_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const steps_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '当前步变化(配合 v-model)', param: '(value: Number)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">步骤条 / STEPS</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">横向</span>
        <div class="kp-steps-wrap">
          <Steps v-model="current" :steps="steps_data" color="cyan" />
          <div class="kp-steps-btns">
            <button class="kp-steps-btn" :disabled="current <= 0" @click="prev">上一步</button>
            <button class="kp-steps-btn" :disabled="current >= steps_data.length - 1" @click="next">下一步</button>
          </div>
          <p class="preview__echo">&gt; 当前:第 {{ current + 1 }} 步 / 共 {{ steps_data.length }} 步</p>
        </div>
      </div>

      <div>
        <span class="kp-label">纵向</span>
        <div class="kp-steps-wrap">
          <Steps v-model="current" :steps="steps_data" direction="vertical" color="green" />
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-steps-wrap">
          <Steps :model-value="1" :steps="steps_data" color="magenta" />
        </div>
      </div>

      <div>
        <span class="kp-label">错误</span>
        <div class="kp-steps-wrap">
          <Steps :model-value="1" :steps="steps_data" status="error" color="cyan" />
        </div>
      </div>

      <div>
        <span class="kp-label">完成</span>
        <div class="kp-steps-wrap">
          <Steps :model-value="3" :steps="steps_data" color="yellow" />
          <p class="preview__echo">&gt; 全部完成</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="steps_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="steps_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="steps_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="steps_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-steps-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.kp-steps-btns {
  display: flex;
  gap: var(--space-sm);
}

.kp-steps-btn {
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
.kp-steps-btn:hover:not(:disabled) { background: rgba(0, 240, 255, 0.12); box-shadow: 0 0 8px rgba(0, 240, 255, 0.4); }
.kp-steps-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
