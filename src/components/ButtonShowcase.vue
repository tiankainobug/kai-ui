<script setup lang="ts">
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// loading 演示:点击后短暂进入加载态
const btn_loading = ref(false)
const trigger_loading = () => {
  btn_loading.value = true
  setTimeout(() => { btn_loading.value = false }, 1500)
}

const button_code = `<KpButton variant="primary">EXECUTE</KpButton>
<KpButton variant="secondary">CANCEL</KpButton>
<KpButton variant="danger">DELETE</KpButton>
<KpButton variant="ghost">GHOST</KpButton>`

const button_props: Record<string, string>[] = [
  { prop: 'variant', desc: '按钮变体', type: 'String', default: 'primary', options: 'primary / secondary / danger / ghost' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'loading', desc: '加载态(跳动圆点)', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'block', desc: '块级宽度(撑满父容器)', type: 'Boolean', default: 'false', options: '-' }
]
const button_slots: Record<string, string>[] = [
  { name: 'default', desc: '按钮文字内容' },
  { name: 'icon', desc: '前置图标' }
]
const button_events: Record<string, string>[] = [
  { name: 'click', desc: '点击事件', param: '(event: MouseEvent)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">按钮 / BUTTON</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">变体</span>
        <div class="kp-row">
          <Button variant="primary">EXECUTE</Button>
          <Button variant="secondary">CANCEL</Button>
          <Button variant="danger">DELETE</Button>
          <Button variant="ghost">GHOST</Button>
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-row">
          <Button variant="primary" size="sm">SMALL</Button>
          <Button variant="primary" size="md">MEDIUM</Button>
          <Button variant="primary" size="lg">LARGE</Button>
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-row">
          <Button variant="primary" :loading="btn_loading" @click="trigger_loading">
            {{ btn_loading ? 'LOADING' : '点击触发' }}
          </Button>
          <Button variant="primary" loading>LOADING</Button>
          <Button variant="primary" disabled>DISABLED</Button>
        </div>
      </div>

      <div>
        <span class="kp-label">图标</span>
        <div class="kp-row">
          <Button variant="primary">
            <template #icon>⚡</template>
            POWER
          </Button>
          <Button variant="secondary">
            <template #icon>◈</template>
            SYNC
          </Button>
          <Button variant="danger">
            <template #icon>✕</template>
            ABORT
          </Button>
        </div>
      </div>

      <div>
        <span class="kp-label">块级</span>
        <div class="kp-row">
          <Button variant="primary" block>BLOCK BUTTON</Button>
        </div>
      </div>
    </div>

    <CodeBlock :code="button_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="button_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="button_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="button_events" />
    </div>
  </section>
</template>
