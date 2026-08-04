<script setup lang="ts">
import { ref } from 'vue'
import Slider from '@/components/Slider.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 交互回显
const volume = ref(30)
const power_range = ref<[number, number]>([20, 80])
const freq = ref(440)

const slider_code = `<KpSlider v-model="volume" :min="0" :max="100" :step="1" color="cyan" />

<!-- 范围(双滑块) -->
<KpSlider v-model="range" range :min="0" :max="100" color="green" />

<!-- 步进 10 -->
<KpSlider v-model="freq" :min="0" :max="1000" :step="10" color="magenta" />`

const slider_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '绑定值(配合 v-model)', type: 'Number / [Number, Number]', default: '0', options: '-' },
  { prop: 'min', desc: '最小值', type: 'Number', default: '0', options: '-' },
  { prop: 'max', desc: '最大值', type: 'Number', default: '100', options: '-' },
  { prop: 'step', desc: '步进', type: 'Number', default: '1', options: '-' },
  { prop: 'range', desc: '是否双滑块范围模式', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'show_tooltip', desc: '显示数值气泡', type: 'Boolean', default: 'true', options: '-' }
]
const slider_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const slider_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '值变化(配合 v-model)', param: '(value: Number | [Number, Number])' },
  { name: 'change', desc: '值变化时触发', param: '(value: Number | [Number, Number])' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">滑块 / SLIDER</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">基础</span>
        <div class="kp-slider-wrap">
          <Slider v-model="volume" color="cyan" />
          <p class="preview__echo">&gt; 音量:{{ volume }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">范围</span>
        <div class="kp-slider-wrap">
          <Slider v-model="power_range" range :min="0" :max="100" color="green" />
          <p class="preview__echo">&gt; 功率区间:{{ power_range[0] }} ~ {{ power_range[1] }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">步进</span>
        <div class="kp-slider-wrap">
          <Slider v-model="freq" :min="0" :max="1000" :step="10" color="magenta" />
          <p class="preview__echo">&gt; 频率:{{ freq }} Hz</p>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-slider-stack">
          <Slider :model-value="40" color="cyan" />
          <Slider :model-value="40" color="magenta" />
          <Slider :model-value="40" color="green" />
          <Slider :model-value="40" color="yellow" />
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-slider-stack">
          <Slider :model-value="50" size="sm" />
          <Slider :model-value="50" size="md" />
          <Slider :model-value="50" size="lg" />
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-slider-stack">
          <Slider :model-value="60" disabled />
          <Slider :model-value="[30, 70]" range disabled color="green" />
        </div>
      </div>
    </div>

    <CodeBlock :code="slider_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="slider_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="slider_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="slider_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-slider-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.kp-slider-stack {
  display: flex;
  flex-direction: column;
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
