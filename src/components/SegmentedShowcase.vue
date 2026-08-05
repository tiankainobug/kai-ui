<script setup lang="ts">
import { ref } from 'vue'
import Segmented from '@/components/Segmented.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const view_mode = ref('grid')
const time_range = ref('day')
const theme = ref('cyan')

const view_options = [
  { label: '列表', value: 'list' },
  { label: '网格', value: 'grid' },
  { label: '地图', value: 'map' }
]
const range_options = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '年', value: 'year' }
]
const theme_options = [
  { label: '青', value: 'cyan' },
  { label: '品', value: 'magenta' },
  { label: '绿', value: 'green' },
  { label: '黄', value: 'yellow' }
]
const disabled_options = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: '禁用', value: 'c', disabled: true }
]

const segmented_code = `<KpSegmented v-model="mode" :options="opts" color="cyan" />

<!-- 块级铺满 -->
<KpSegmented v-model="mode" :options="opts" block color="green" />`

const segmented_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '当前值(配合 v-model)', type: 'String / Number', default: "''", options: '-' },
  { prop: 'options', desc: '选项数据', type: 'Array<{ label, value, disabled? }>', default: '[]', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'block', desc: '块级铺满父容器', type: 'Boolean', default: 'false', options: '-' }
]
const segmented_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const segmented_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '值变化(配合 v-model)', param: '(value: String | Number)' },
  { name: 'change', desc: '切换时触发', param: '(value: String | Number)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">分段控制器 / SEGMENTED</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">基础</span>
        <div class="kp-segmented-wrap">
          <Segmented v-model="view_mode" :options="view_options" color="cyan" />
          <p class="preview__echo">&gt; 视图:{{ view_mode }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">块级</span>
        <div class="kp-segmented-wrap">
          <Segmented v-model="time_range" :options="range_options" block color="green" />
          <p class="preview__echo">&gt; 范围:{{ time_range }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-segmented-stack">
          <Segmented :model-value="'a'" :options="view_options" size="sm" />
          <Segmented :model-value="'a'" :options="view_options" size="md" />
          <Segmented :model-value="'a'" :options="view_options" size="lg" />
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-segmented-wrap">
          <Segmented v-model="theme" :options="theme_options" :color="theme as any" />
          <p class="preview__echo">&gt; 主题:{{ theme }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">禁用</span>
        <div class="kp-segmented-wrap">
          <Segmented :model-value="'a'" :options="disabled_options" color="magenta" />
        </div>
      </div>
    </div>

    <CodeBlock :code="segmented_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="segmented_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="segmented_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="segmented_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-segmented-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.kp-segmented-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  align-items: flex-start;
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
