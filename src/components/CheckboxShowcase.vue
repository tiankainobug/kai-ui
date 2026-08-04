<script setup lang="ts">
import { ref, computed } from 'vue'
import Checkbox from '@/components/Checkbox.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 开关用法:布尔模式
const agree = ref(false)

// 多选组合:数组模式 + value,配全选 / 半选联动
const options = [
  { label: '神经接口', value: 'neural' },
  { label: '光学迷彩', value: 'camo' },
  { label: '义体强化', value: 'cyberware' },
  { label: '黑客模块', value: 'hacker' }
]
const checked_vals = ref<(string | number)[]>(['neural', 'camo'])

const all_checked = computed(() => checked_vals.value.length === options.length)
const some_checked = computed(() => checked_vals.value.length > 0 && !all_checked.value)

// 全选框点击:布尔模式下收到 boolean,全选 / 清空
const toggle_all = (val: boolean | (string | number)[]) => {
  checked_vals.value = val ? options.map(o => o.value) : []
}
const set_group = (val: boolean | (string | number)[]) => {
  checked_vals.value = val as (string | number)[]
}

const checkbox_code = `<KpCheckbox v-model="agree" label="接受协议" color="green" />

<!-- 数组多选:同一 v-model + 各自 value -->
<KpCheckbox v-model="vals" value="a" label="选项 A" />
<KpCheckbox v-model="vals" value="b" label="选项 B" />

<!-- 全选联动:部分选中时 indeterminate 显示半选 -->
<KpCheckbox :model-value="all" :indeterminate="some" label="全选" />`

const checkbox_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '绑定值(配合 v-model)', type: 'Boolean / (String|Number)[]', default: 'false', options: '-' },
  { prop: 'value', desc: '数组模式下该项标识值', type: 'String / Number', default: '-', options: '-' },
  { prop: 'label', desc: '标签文字', type: 'String', default: "''", options: '-' },
  { prop: 'color', desc: '勾选霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'indeterminate', desc: '半选(不确定态)', type: 'Boolean', default: 'false', options: '-' }
]
const checkbox_slots: Record<string, string>[] = [
  { name: 'default', desc: '标签内容(传入则覆盖 label)' }
]
const checkbox_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '值变化(配合 v-model)', param: '(value: Boolean | (String|Number)[])' },
  { name: 'change', desc: '值变化时触发', param: '(value: Boolean | (String|Number)[])' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">多选框 / CHECKBOX</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-row">
          <Checkbox :model-value="true" label="CYAN" color="cyan" />
          <Checkbox :model-value="true" label="MAGENTA" color="magenta" />
          <Checkbox :model-value="true" label="GREEN" color="green" />
          <Checkbox :model-value="true" label="YELLOW" color="yellow" />
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-row">
          <Checkbox :model-value="true" size="sm" label="SMALL" />
          <Checkbox :model-value="true" size="md" label="MEDIUM" />
          <Checkbox :model-value="true" size="lg" label="LARGE" />
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-row">
          <Checkbox :model-value="false" label="默认" />
          <Checkbox :model-value="true" label="勾选" />
          <Checkbox :indeterminate="true" label="半选" />
          <Checkbox :model-value="true" disabled label="禁用(选中)" />
          <Checkbox :model-value="false" disabled label="禁用(未选)" />
        </div>
      </div>

      <div>
        <span class="kp-label">开关</span>
        <div class="kp-checkbox-stack">
          <Checkbox
            :model-value="agree"
            color="green"
            label="我已阅读并接受《赛博朋克终端协议》"
            @update:model-value="(v) => (agree = !!v)"
          />
          <p class="preview__echo">&gt; 当前状态:{{ agree ? '已接受' : '未接受' }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">多选组合</span>
        <div class="kp-checkbox-stack">
          <Checkbox
            :model-value="all_checked"
            :indeterminate="some_checked"
            label="全选 / 全不选"
            @update:model-value="toggle_all"
          />
          <div class="kp-checkbox-group">
            <Checkbox
              v-for="opt in options"
              :key="opt.value"
              :model-value="checked_vals"
              :value="opt.value"
              :label="opt.label"
              @update:model-value="set_group"
            />
          </div>
          <p class="preview__echo">&gt; 已选:{{ checked_vals.length ? checked_vals.join(', ') : '(空)' }}</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="checkbox_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="checkbox_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="checkbox_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="checkbox_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-checkbox-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* 子项缩进 + 左侧分隔线,呼应全选项 */
.kp-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-left: var(--space-lg);
  border-left: 1px solid var(--border-color);
}

.preview__echo {
  margin-top: var(--space-xs);
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
