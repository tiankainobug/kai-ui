<script setup lang="ts">
import { ref } from 'vue'
import Select from '@/components/Select.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 选项数据
const city_options = [
  { label: '夜之城', value: 'night' },
  { label: '新东京', value: 'tokyo' },
  { label: '香港九龙', value: 'hk' },
  { label: '柏林矩阵', value: 'berlin' },
  { label: '黑市站点(禁用)', value: 'black', disabled: true }
]

const module_options = [
  { label: '神经接口', value: 'neural' },
  { label: '光学迷彩', value: 'camo' },
  { label: '义体强化', value: 'cyberware' },
  { label: '黑客入侵', value: 'hacker' },
  { label: '无人机群', value: 'drone' }
]

// 交互回显
const single_val = ref<string | number>('night')
const multi_val = ref<(string | number)[]>(['neural', 'camo'])
const search_val = ref<string | number | undefined>(undefined)

const select_code = `<KpSelect v-model="city" :options="city_options" placeholder="选择城市" />

<!-- 多选 -->
<KpSelect v-model="mods" :options="module_options" multiple color="green" />

<!-- 可搜索 + 可清空 -->
<KpSelect v-model="v" :options="opts" filterable clearable color="magenta" />`

const select_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '绑定值(配合 v-model)', type: 'String / Number / (String|Number)[]', default: '-', options: '-' },
  { prop: 'options', desc: '选项数据', type: 'Array<{ label, value, disabled? }>', default: '[]', options: '-' },
  { prop: 'multiple', desc: '是否多选', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'filterable', desc: '是否可搜索', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'clearable', desc: '是否可清空', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'placeholder', desc: '占位文字', type: 'String', default: '请选择', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' }
]
const select_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无具名插槽' }
]
const select_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '值变化(配合 v-model)', param: '(value: String | Number | (String|Number)[])' },
  { name: 'change', desc: '值变化时触发', param: '(value: String | Number | (String|Number)[])' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">下拉选择 / SELECT</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">单选</span>
        <div class="kp-row">
          <Select
            v-model="single_val"
            :options="city_options"
            placeholder="选择城市"
            color="cyan"
            @change="(v) => (single_val = v as string | number)"
          />
        </div>
      </div>

      <div>
        <span class="kp-label">多选</span>
        <div class="kp-row">
          <Select
            v-model="multi_val"
            :options="module_options"
            multiple
            color="green"
          />
        </div>
      </div>

      <div>
        <span class="kp-label">可搜索</span>
        <div class="kp-row">
          <Select
            v-model="search_val"
            :options="city_options"
            filterable
            clearable
            color="magenta"
            placeholder="搜索城市..."
          />
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-row">
          <Select :model-value="'night'" :options="city_options" color="cyan" />
          <Select :model-value="'night'" :options="city_options" color="magenta" />
          <Select :model-value="'night'" :options="city_options" color="green" />
          <Select :model-value="'night'" :options="city_options" color="yellow" />
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-row">
          <Select :model-value="'night'" :options="city_options" size="sm" />
          <Select :model-value="'night'" :options="city_options" size="md" />
          <Select :model-value="'night'" :options="city_options" size="lg" />
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-row">
          <Select :model-value="undefined" :options="city_options" placeholder="空状态" />
          <Select :model-value="'night'" :options="city_options" disabled />
        </div>
      </div>

      <div>
        <span class="kp-label">交互</span>
        <div class="kp-select-stack">
          <p class="preview__echo">&gt; 单选城市:{{ single_val || '(空)' }}</p>
          <p class="preview__echo">&gt; 已选模块:{{ multi_val.length ? multi_val.join(', ') : '(空)' }}</p>
          <p class="preview__echo">&gt; 搜索结果:{{ search_val ?? '(空)' }}</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="select_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="select_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="select_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="select_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-select-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
