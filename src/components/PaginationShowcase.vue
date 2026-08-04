<script setup lang="ts">
import { ref } from 'vue'
import Pagination from '@/components/Pagination.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const current = ref(1)
const current2 = ref(5)
const current3 = ref(1)

const pagination_code = `<KpPagination v-model="page" :total="100" :page-size="10" />

<!-- 隐藏跳转 -->
<KpPagination v-model="page" :total="50" :show_jumper="false" color="green" />`

const pagination_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '当前页(配合 v-model)', type: 'Number', default: '1', options: '-' },
  { prop: 'total', desc: '总条数', type: 'Number', default: '0', options: '-' },
  { prop: 'page_size', desc: '每页条数', type: 'Number', default: '10', options: '-' },
  { prop: 'show_jumper', desc: '显示快速跳转', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'show_total', desc: '显示总数', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' }
]
const pagination_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const pagination_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '当前页变化(配合 v-model)', param: '(value: Number)' },
  { name: 'change', desc: '页码变化时触发', param: '(page: Number, page_size: Number)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">分页 / PAGINATION</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">基础</span>
        <div class="kp-pagination-wrap">
          <Pagination v-model="current" :total="120" :page_size="10" color="cyan" />
          <p class="preview__echo">&gt; 当前页:{{ current }}</p>
        </div>
      </div>

      <div>
        <span class="kp-label">中间页</span>
        <div class="kp-pagination-wrap">
          <Pagination v-model="current2" :total="200" :page_size="10" color="green" />
          <p class="preview__echo">&gt; 当前页:{{ current2 }} / 20</p>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-pagination-stack">
          <Pagination :model-value="3" :total="100" color="cyan" :show_jumper="false" :show_total="false" />
          <Pagination :model-value="3" :total="100" color="magenta" :show_jumper="false" :show_total="false" />
          <Pagination :model-value="3" :total="100" color="green" :show_jumper="false" :show_total="false" />
          <Pagination :model-value="3" :total="100" color="yellow" :show_jumper="false" :show_total="false" />
        </div>
      </div>

      <div>
        <span class="kp-label">变体</span>
        <div class="kp-pagination-stack">
          <Pagination :model-value="1" :total="5" color="cyan" :show_jumper="false" :show_total="false" />
          <Pagination :model-value="2" :total="30" color="cyan" :show_total="false" />
          <Pagination v-model="current3" :total="1000" :page_size="20" color="cyan" />
        </div>
      </div>
    </div>

    <CodeBlock :code="pagination_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="pagination_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="pagination_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="pagination_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-pagination-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.kp-pagination-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
