<script setup lang="ts">
import { ref } from 'vue'
import ApiTable from '@/components/ApiTable.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import DateTimePicker from '@/components/DateTimePicker.vue'
import { events_columns, props_columns } from '@/data/api-columns'

// 基础选择值:演示空值选择和实时回显
const basic_value = ref('')

// 默认日期时间值:演示预设值与清空功能
const preset_value = ref('2026-08-04 14:30')

// 含秒值:演示秒级精度
const seconds_value = ref('2026-08-04 09:15:42')

// 限制值:演示最小和最大可选时间
const limited_value = ref('2026-08-15 12:00')

// 组件代码示例:展示常用绑定和时间边界写法
const date_time_picker_code = `<KpDateTimePicker v-model="datetime" placeholder="选择执行时间" />

<KpDateTimePicker
  v-model="deployAt"
  show-seconds
  min="2026-08-10 08:00"
  max="2026-08-20 20:00"
  clearable
/>

<KpDateTimePicker :error="'时间校验失败'" />`

// Props 文档:描述日期时间选择器可配置项
const date_time_picker_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '绑定日期时间，格式为 YYYY-MM-DD HH:mm[:ss]', type: 'String', default: "''", options: '-' },
  { prop: 'placeholder', desc: '未选择时的占位文本', type: 'String', default: '请选择日期时间', options: '-' },
  { prop: 'min', desc: '最小可选时间，格式为 YYYY-MM-DD HH:mm[:ss]', type: 'String', default: "''", options: '-' },
  { prop: 'max', desc: '最大可选时间，格式为 YYYY-MM-DD HH:mm[:ss]', type: 'String', default: "''", options: '-' },
  { prop: 'showSeconds', desc: '是否显示并选择秒', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'disabled', desc: '是否禁用选择器', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'clearable', desc: '选中后是否显示清空按钮', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'error', desc: '错误态，字符串会同时显示提示文字', type: 'String / Boolean', default: 'false', options: '-' },
  { prop: 'size', desc: '输入框尺寸', type: 'String', default: 'md', options: 'sm / md / lg' }
]

// Events 文档:描述日期时间选择器对外事件
const date_time_picker_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '确认选择时更新绑定值', param: '(value: String)' },
  { name: 'change', desc: '确认选择或清空时触发', param: '(value: String)' },
  { name: 'clear', desc: '点击清空按钮时触发', param: '-' },
  { name: 'open', desc: '面板打开时触发', param: '-' },
  { name: 'close', desc: '面板关闭时触发', param: '-' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">日期时间选择器 / DATE TIME PICKER</h2>

    <div class="kp-demo kp-datetime-demo">
      <div>
        <span class="kp-label">基础用法</span>
        <div class="kp-datetime-stack">
          <DateTimePicker v-model="basic_value" placeholder="选择执行时间" />
          <p class="preview__echo">&gt; 当前时间:{{ basic_value || '(未选择)' }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">默认值</span>
        <div class="kp-datetime-stack">
          <DateTimePicker v-model="preset_value" />
          <p class="preview__echo">&gt; 已载入:{{ preset_value || '(已清空)' }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">含秒</span>
        <div class="kp-datetime-stack">
          <DateTimePicker v-model="seconds_value" show-seconds />
          <p class="preview__echo">&gt; 已载入:{{ seconds_value || '(已清空)' }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-datetime-stack">
          <DateTimePicker size="sm" placeholder="SMALL" />
          <DateTimePicker size="md" placeholder="MEDIUM" />
          <DateTimePicker size="lg" placeholder="LARGE" />
        </div>
      </div>

      <div>
        <span class="kp-label">时间范围</span>
        <div class="kp-datetime-stack">
          <DateTimePicker
            v-model="limited_value"
            min="2026-08-10 08:00"
            max="2026-08-20 20:00"
          />
          <p class="preview__echo">&gt; 可选范围:2026-08-10 08:00 / 2026-08-20 20:00</p>
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-datetime-stack">
          <DateTimePicker model-value="2026-08-04 14:30" disabled />
          <DateTimePicker error="时间超出任务周期" placeholder="错误状态" />
        </div>
      </div>
    </div>

    <CodeBlock :code="date_time_picker_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="date_time_picker_props" />
      <ApiTable title="Events" :columns="events_columns" :rows="date_time_picker_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-datetime-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 100%;
  max-width: 420px;
}

.preview__echo {
  margin-top: var(--space-xs);
  color: var(--neon-green);
  font-size: 12px;
  letter-spacing: 0;
}
</style>
