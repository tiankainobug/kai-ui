<script setup lang="ts">
import { ref } from 'vue'
import Switch from '@/components/Switch.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 交互回显:接收用户切换并显示当前状态
const power = ref(false)
const shield = ref(true)

const switch_code = `<KpSwitch v-model="power" color="cyan" label="主电源" />

<!-- 带开关文字 -->
<KpSwitch v-model="shield" active-text="ON" inactive-text="OFF" color="green" />

<!-- 加载中 -->
<KpSwitch :model-value="true" loading color="magenta" />

<!-- 禁用 -->
<KpSwitch :model-value="true" disabled />`

const switch_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '绑定值(配合 v-model)', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'color', desc: '开启时霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'loading', desc: '加载中(不可交互)', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'active_text', desc: '开启时显示文字', type: 'String', default: "''", options: '-' },
  { prop: 'inactive_text', desc: '关闭时显示文字', type: 'String', default: "''", options: '-' },
  { prop: 'label', desc: '标签文字', type: 'String', default: "''", options: '-' }
]
const switch_slots: Record<string, string>[] = [
  { name: 'default', desc: '标签内容(传入则覆盖 label)' }
]
const switch_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '值变化(配合 v-model)', param: '(value: Boolean)' },
  { name: 'change', desc: '值变化时触发', param: '(value: Boolean)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">开关 / SWITCH</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-row">
          <Switch :model-value="false" color="cyan" label="CYAN" />
          <Switch :model-value="false" color="magenta" label="MAGENTA" />
          <Switch :model-value="false" color="green" label="GREEN" />
          <Switch :model-value="false" color="yellow" label="YELLOW" />
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-row">
          <Switch :model-value="true" size="sm" label="SMALL" />
          <Switch :model-value="true" size="md" label="MEDIUM" />
          <Switch :model-value="true" size="lg" label="LARGE" />
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-row">
          <Switch :model-value="false" label="关闭" />
          <Switch :model-value="true" label="开启" />
          <Switch :model-value="true" loading color="magenta" label="加载中" />
          <Switch :model-value="true" disabled label="禁用(开)" />
          <Switch :model-value="false" disabled label="禁用(关)" />
        </div>
      </div>

      <div>
        <span class="kp-label">文字</span>
        <div class="kp-row">
          <Switch :model-value="true" active-text="ON" inactive-text="OFF" color="green" />
          <Switch :model-value="false" active-text="启用" inactive-text="停用" color="yellow" />
          <Switch :model-value="true" active-text="●" inactive-text="○" color="cyan" />
        </div>
      </div>

      <div>
        <span class="kp-label">交互</span>
        <div class="kp-switch-stack">
          <Switch v-model="power" color="cyan" label="主电源" />
          <Switch v-model="shield" active-text="ON" inactive-text="OFF" color="green" label="能量护盾" />
          <p class="preview__echo">&gt; 主电源:{{ power ? 'ON' : 'OFF' }} ｜ 护盾:{{ shield ? 'ON' : 'OFF' }}</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="switch_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="switch_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="switch_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="switch_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-switch-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.preview__echo {
  margin-top: var(--space-xs);
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
