<script setup lang="ts">
import { ref } from 'vue'
import Input from '@/components/Input.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 输入框双向绑定演示
const input_value = ref('')
const search_value = ref('cyberpunk')

// 错误态演示:传入字符串会显示错误提示文字
const error_msg = ref('校验失败:该 ID 已被占用')

const input_code = `<KpInput v-model="text" placeholder="输入指令..." />
<KpInput variant="glow" clearable />
<KpInput :error="true" placeholder="校验失败" />`

const input_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '绑定值(配合 v-model)', type: 'String', default: "''", options: '-' },
  { prop: 'variant', desc: '变体', type: 'String', default: 'default', options: 'default / glow' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'placeholder', desc: '占位文本', type: 'String', default: "''", options: '-' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'error', desc: '错误态(字符串显示提示文字)', type: 'String / Boolean', default: 'false', options: '-' },
  { prop: 'clearable', desc: '显示一键清空按钮', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'type', desc: '原生输入类型', type: 'String', default: 'text', options: 'text / password / number...' }
]
const input_slots: Record<string, string>[] = [
  { name: 'prefix', desc: '前缀内容' },
  { name: 'suffix', desc: '后缀内容' }
]
const input_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '值变化(配合 v-model)', param: '(value: String)' },
  { name: 'clear', desc: '点击清空按钮时触发', param: '-' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">输入框 / INPUT</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">变体</span>
        <div class="kp-input-grid">
          <Input v-model="input_value" placeholder="default 默认描边" />
          <Input variant="glow" placeholder="glow 常态发光" />
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-input-grid">
          <Input size="sm" placeholder="small" />
          <Input size="md" placeholder="medium" />
          <Input size="lg" placeholder="large" />
        </div>
      </div>

      <div>
        <span class="kp-label">清空</span>
        <div class="kp-input-grid">
          <Input v-model="search_value" placeholder="搜索..." clearable variant="glow" />
          <p class="preview__echo">&gt; 当前值:{{ search_value || '(空)' }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-input-grid">
          <Input placeholder="禁用状态" disabled />
          <Input :error="error_msg" placeholder="错误状态 · 输入触发校验" clearable />
        </div>
      </div>

      <div>
        <span class="kp-label">前后缀</span>
        <div class="kp-input-grid">
          <Input placeholder="带前缀图标" variant="glow">
            <template #prefix>⌕</template>
          </Input>
          <Input placeholder="带后缀" clearable>
            <template #suffix>@</template>
          </Input>
        </div>
      </div>
    </div>

    <CodeBlock :code="input_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="input_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="input_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="input_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-input-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-width: 420px;
}

.preview__echo {
  margin-top: var(--space-xs);
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
