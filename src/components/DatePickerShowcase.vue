<script setup lang="ts">
import { ref } from 'vue'
import ApiTable from '@/components/ApiTable.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import DatePicker from '@/components/DatePicker.vue'
import { events_columns, props_columns } from '@/data/api-columns'

// 基础选择值:演示空值选择和实时回显
const basic_value = ref('')

// 默认日期值:演示预设日期与清空功能
const preset_value = ref('2026-08-04')

// 限制日期值:演示最小和最大可选日期
const limited_value = ref('2026-08-15')

// 组件代码示例:展示常用绑定和日期边界写法
const date_picker_code = `<KpDatePicker v-model="date" placeholder="选择任务日期" />

<KpDatePicker
  v-model="deployDate"
  min="2026-08-10"
  max="2026-08-20"
  clearable
/>

<KpDatePicker :error="'日期校验失败'" />`

// Props 文档:描述日期选择器可配置项
const date_picker_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '绑定日期，格式为 YYYY-MM-DD', type: 'String', default: "''", options: '-' },
  { prop: 'placeholder', desc: '未选择时的占位文本', type: 'String', default: '请选择日期', options: '-' },
  { prop: 'min', desc: '最小可选日期，格式为 YYYY-MM-DD', type: 'String', default: "''", options: '-' },
  { prop: 'max', desc: '最大可选日期，格式为 YYYY-MM-DD', type: 'String', default: "''", options: '-' },
  { prop: 'disabled', desc: '是否禁用日期选择器', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'clearable', desc: '选中日期后是否显示清空按钮', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'error', desc: '错误态，字符串会同时显示提示文字', type: 'String / Boolean', default: 'false', options: '-' },
  { prop: 'size', desc: '输入框尺寸', type: 'String', default: 'md', options: 'sm / md / lg' }
]

// Events 文档:描述日期选择器对外事件
const date_picker_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '日期变化时更新绑定值', param: '(value: String)' },
  { name: 'change', desc: '选择或清空日期时触发', param: '(value: String)' },
  { name: 'clear', desc: '点击清空按钮时触发', param: '-' },
  { name: 'open', desc: '日历弹层打开时触发', param: '-' },
  { name: 'close', desc: '日历弹层关闭时触发', param: '-' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">日期选择器 / DATE PICKER</h2>

    <div class="kp-demo kp-datepicker-demo">
      <div>
        <span class="kp-label">基础用法</span>
        <div class="kp-datepicker-stack">
          <DatePicker v-model="basic_value" placeholder="选择任务日期" />
          <p class="preview__echo">&gt; 当前日期:{{ basic_value || '(未选择)' }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">默认值</span>
        <div class="kp-datepicker-stack">
          <DatePicker v-model="preset_value" />
          <p class="preview__echo">&gt; 已载入:{{ preset_value || '(已清空)' }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-datepicker-stack">
          <DatePicker size="sm" placeholder="SMALL" />
          <DatePicker size="md" placeholder="MEDIUM" />
          <DatePicker size="lg" placeholder="LARGE" />
        </div>
      </div>

      <div>
        <span class="kp-label">日期范围</span>
        <div class="kp-datepicker-stack">
          <DatePicker
            v-model="limited_value"
            min="2026-08-10"
            max="2026-08-20"
          />
          <p class="preview__echo">&gt; 可选范围:2026-08-10 / 2026-08-20</p>
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-datepicker-stack">
          <DatePicker model-value="2026-08-04" disabled />
          <DatePicker error="日期超出任务周期" placeholder="错误状态" />
        </div>
      </div>
    </div>

    <CodeBlock :code="date_picker_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="date_picker_props" />
      <ApiTable title="Events" :columns="events_columns" :rows="date_picker_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-datepicker-stack {
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
