<script setup lang="ts">
import { ref } from 'vue'
import Radio from '@/components/Radio.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

type RadioColor = 'cyan' | 'magenta' | 'green' | 'yellow'
type RadioSize = 'sm' | 'md' | 'lg'

// 颜色单选组:共享 v-model 互斥切换
const color_val = ref('cyan')
const color_opts: { label: string; value: string; color: RadioColor }[] = [
  { label: 'CYAN', value: 'cyan', color: 'cyan' },
  { label: 'MAGENTA', value: 'magenta', color: 'magenta' },
  { label: 'GREEN', value: 'green', color: 'green' },
  { label: 'YELLOW', value: 'yellow', color: 'yellow' }
]

// 尺寸单选组
const size_val = ref('md')
const size_opts: { label: string; value: string; size: RadioSize }[] = [
  { label: 'SMALL', value: 'sm', size: 'sm' },
  { label: 'MEDIUM', value: 'md', size: 'md' },
  { label: 'LARGE', value: 'lg', size: 'lg' }
]

// 基础单选组:选择网络协议
const proto_val = ref('tcp')
const proto_opts = [
  { label: 'TCP', value: 'tcp' },
  { label: 'UDP', value: 'udp' },
  { label: 'QUIC', value: 'quic' },
  { label: 'WEBRTC', value: 'webrtc' }
]

const radio_code = `<!-- 单选组:同一 v-model + 各自 value,选中互斥 -->
<KpRadio v-model="proto" value="tcp" label="TCP" />
<KpRadio v-model="proto" value="udp" label="UDP" />
<KpRadio v-model="proto" value="quic" label="QUIC" />

<!-- 颜色 / 尺寸 / 禁用 -->
<KpRadio v-model="proto" value="tcp" label="TCP" color="green" size="lg" />
<KpRadio v-model="proto" value="tcp" label="TCP" disabled />`

const radio_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '绑定值(配合 v-model,组内共享)', type: 'String / Number', default: "''", options: '-' },
  { prop: 'value', desc: '该项标识值(与 modelValue 相等即选中)', type: 'String / Number', default: '-', options: '-' },
  { prop: 'label', desc: '标签文字', type: 'String', default: "''", options: '-' },
  { prop: 'color', desc: '选中霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' }
]
const radio_slots: Record<string, string>[] = [
  { name: 'default', desc: '标签内容(传入则覆盖 label)' }
]
const radio_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '值变化(配合 v-model)', param: '(value: String | Number)' },
  { name: 'change', desc: '值变化时触发', param: '(value: String | Number)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">单选框 / RADIO</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-row">
          <Radio
            v-for="opt in color_opts"
            :key="opt.value"
            v-model="color_val"
            :value="opt.value"
            :label="opt.label"
            :color="opt.color"
          />
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-row">
          <Radio
            v-for="opt in size_opts"
            :key="opt.value"
            v-model="size_val"
            :value="opt.value"
            :label="opt.label"
            :size="opt.size"
          />
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-row">
          <Radio model-value="a" value="b" label="默认" />
          <Radio model-value="a" value="a" label="选中" />
          <Radio model-value="a" value="a" disabled label="禁用(选中)" />
          <Radio model-value="a" value="b" disabled label="禁用(未选)" />
        </div>
      </div>

      <div>
        <span class="kp-label">单选组合</span>
        <div class="kp-radio-stack">
          <div class="kp-radio-group">
            <Radio
              v-for="opt in proto_opts"
              :key="opt.value"
              v-model="proto_val"
              :value="opt.value"
              :label="opt.label"
            />
          </div>
          <p class="preview__echo">&gt; 当前协议:{{ proto_val.toUpperCase() }}</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="radio_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="radio_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="radio_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="radio_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-radio-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

/* 单选组纵向排列 + 左侧分隔线 */
.kp-radio-group {
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
