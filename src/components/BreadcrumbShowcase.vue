<script setup lang="ts">
import Breadcrumb from '@/components/Breadcrumb.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const items_basic = [
  { title: '首页' },
  { title: '节点管理' },
  { title: '夜之城' }
]
const items_link = [
  { title: '首页', to: '#home' },
  { title: '系统', to: '#sys' },
  { title: '网络', to: '#net' },
  { title: '当前节点' }
]
const items_icon = [
  { title: '终端', icon: '⌂' },
  { title: '日志', icon: '▤' },
  { title: '安全报告', icon: '⚠' }
]

const breadcrumb_code = `<KpBreadcrumb :items="items" separator="/" color="cyan" />

<!-- 带图标 -->
<KpBreadcrumb :items="items" separator=">" color="green" />`

const breadcrumb_props: Record<string, string>[] = [
  { prop: 'items', desc: '路径项', type: 'Array<{ title, to?, icon? }>', default: '[]', options: '-' },
  { prop: 'separator', desc: '分隔符', type: 'String', default: '/', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' }
]
const breadcrumb_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const breadcrumb_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">面包屑 / BREADCRUMB</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">基础</span>
        <div class="kp-breadcrumb-wrap">
          <Breadcrumb :items="items_basic" color="cyan" />
        </div>
      </div>

      <div>
        <span class="kp-label">链接</span>
        <div class="kp-breadcrumb-wrap">
          <Breadcrumb :items="items_link" color="green" />
        </div>
      </div>

      <div>
        <span class="kp-label">图标</span>
        <div class="kp-breadcrumb-wrap">
          <Breadcrumb :items="items_icon" separator=">" color="magenta" />
        </div>
      </div>

      <div>
        <span class="kp-label">分隔符</span>
        <div class="kp-breadcrumb-stack">
          <Breadcrumb :items="items_basic" separator="/" color="cyan" />
          <Breadcrumb :items="items_basic" separator=">" color="green" />
          <Breadcrumb :items="items_basic" separator="·" color="yellow" />
          <Breadcrumb :items="items_basic" separator="›" color="magenta" />
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-breadcrumb-stack">
          <Breadcrumb :items="items_basic" color="cyan" />
          <Breadcrumb :items="items_basic" color="magenta" />
          <Breadcrumb :items="items_basic" color="green" />
          <Breadcrumb :items="items_basic" color="yellow" />
        </div>
      </div>
    </div>

    <CodeBlock :code="breadcrumb_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="breadcrumb_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="breadcrumb_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="breadcrumb_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-breadcrumb-wrap {
  display: flex;
  align-items: center;
}

.kp-breadcrumb-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}
</style>
