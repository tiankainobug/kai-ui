<script setup lang="ts">
import { ref } from 'vue'
import Rate from '@/components/Rate.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 交互回显
const rating = ref(3)
const half_rating = ref(2.5)

const rate_code = `<KpRate v-model="rating" :max="5" color="yellow" />

<!-- 半选 -->
<KpRate v-model="rating" allow-half color="cyan" />

<!-- 只读 -->
<KpRate :model-value="4" readonly />

<!-- 自定义图标 -->
<KpRate v-model="rating" icon="◆" color="magenta" />`

const rate_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '当前分值(配合 v-model)', type: 'Number', default: '0', options: '-' },
  { prop: 'max', desc: '最大星数', type: 'Number', default: '5', options: '-' },
  { prop: 'allow_half', desc: '允许半选', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'readonly', desc: '只读', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'yellow', options: 'cyan / magenta / green / yellow' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'icon', desc: '图标字符', type: 'String', default: '★', options: '-' }
]
const rate_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const rate_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '分值变化(配合 v-model)', param: '(value: Number)' },
  { name: 'change', desc: '分值变化时触发', param: '(value: Number)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">评分 / RATE</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">基础</span>
        <div class="kp-rate-row">
          <Rate v-model="rating" color="yellow" />
          <p class="preview__echo">&gt; 评分:{{ rating }} / 5</p>
        </div>
      </div>

      <div>
        <span class="kp-label">半选</span>
        <div class="kp-rate-row">
          <Rate v-model="half_rating" allow_half color="cyan" />
          <p class="preview__echo">&gt; 评分:{{ half_rating }} / 5</p>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-rate-row">
          <Rate :model-value="3" color="yellow" />
          <Rate :model-value="3" color="cyan" />
          <Rate :model-value="3" color="magenta" />
          <Rate :model-value="3" color="green" />
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-rate-row">
          <Rate :model-value="3" size="sm" />
          <Rate :model-value="3" size="md" />
          <Rate :model-value="3" size="lg" />
        </div>
      </div>

      <div>
        <span class="kp-label">图标</span>
        <div class="kp-rate-row">
          <Rate :model-value="4" icon="★" color="yellow" />
          <Rate :model-value="4" icon="◆" color="magenta" />
          <Rate :model-value="4" icon="●" color="cyan" />
          <Rate :model-value="4" icon="▲" color="green" />
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-rate-row">
          <Rate :model-value="4" readonly />
          <Rate :model-value="2" disabled />
        </div>
      </div>

      <div>
        <span class="kp-label">数量</span>
        <div class="kp-rate-row">
          <Rate :model-value="7" :max="10" color="green" />
          <Rate :model-value="3" :max="3" allow_half color="cyan" />
        </div>
      </div>
    </div>

    <CodeBlock :code="rate_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="rate_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="rate_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="rate_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-rate-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-lg);
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
