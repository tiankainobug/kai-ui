<script setup lang="ts">
import { ref } from 'vue'
import Drawer from '@/components/Drawer.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const visible = ref(false)
const placement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const color = ref<'cyan' | 'magenta' | 'green' | 'yellow'>('cyan')
const last_closed = ref('')

const open = (p: 'left' | 'right' | 'top' | 'bottom', c: 'cyan' | 'magenta' | 'green' | 'yellow' = 'cyan') => {
  placement.value = p
  color.value = c
  visible.value = true
}

const drawer_code = `<KpDrawer v-model="visible" title="详情" placement="right" :width="380" color="cyan">
  抽屉内容
  <template #footer>
    <button @click="visible = false">关闭</button>
  </template>
</KpDrawer>`

const drawer_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '是否显示(配合 v-model)', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'title', desc: '标题', type: 'String', default: "''", options: '-' },
  { prop: 'placement', desc: '滑出方向', type: 'String', default: 'right', options: 'left / right / top / bottom' },
  { prop: 'width', desc: '宽度(左右方向)', type: 'Number / String', default: '380', options: '-' },
  { prop: 'height', desc: '高度(上下方向)', type: 'Number / String', default: '300', options: '-' },
  { prop: 'show_close', desc: '显示关闭图标', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'mask_closable', desc: '点击遮罩可关闭', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' }
]
const drawer_slots: Record<string, string>[] = [
  { name: 'default', desc: '内容区' },
  { name: 'title', desc: '自定义标题' },
  { name: 'footer', desc: '底部操作区' }
]
const drawer_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '显示状态变化(配合 v-model)', param: '(value: Boolean)' },
  { name: 'close', desc: '关闭时触发', param: '-' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">抽屉 / DRAWER</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">方向</span>
        <div class="kp-row">
          <button class="kp-drawer-btn" @click="open('left')">LEFT</button>
          <button class="kp-drawer-btn" @click="open('right')">RIGHT</button>
          <button class="kp-drawer-btn" @click="open('top')">TOP</button>
          <button class="kp-drawer-btn" @click="open('bottom')">BOTTOM</button>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-row">
          <button class="kp-drawer-btn kp-drawer-btn--green" @click="open('right', 'green')">GREEN</button>
          <button class="kp-drawer-btn kp-drawer-btn--magenta" @click="open('left', 'magenta')">MAGENTA</button>
          <button class="kp-drawer-btn kp-drawer-btn--yellow" @click="open('bottom', 'yellow')">YELLOW</button>
        </div>
      </div>

      <div>
        <span class="kp-label">回显</span>
        <p class="preview__echo">&gt; {{ last_closed || '点击上方按钮打开抽屉' }}</p>
      </div>
    </div>

    <Drawer
      v-model="visible"
      :title="`${placement} 抽屉`"
      :placement="placement"
      :color="color"
      @close="last_closed = `${placement} 抽屉已关闭`"
    >
      <div class="kp-drawer-content">
        <p>&gt; 方向:{{ placement }}</p>
        <p>&gt; 配色:{{ color }}</p>
        <p>&gt; 支持点击遮罩关闭</p>
        <p>&gt; 支持 ESC 键关闭</p>
        <p>&gt; 内容区可滚动</p>
      </div>
      <template #footer>
        <button class="kp-drawer-btn" @click="visible = false">确认</button>
      </template>
    </Drawer>

    <CodeBlock :code="drawer_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="drawer_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="drawer_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="drawer_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-drawer-btn {
  padding: 8px 18px;
  border: 1px solid var(--neon-cyan);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-drawer-btn:hover { background: rgba(0, 240, 255, 0.12); box-shadow: 0 0 8px rgba(0, 240, 255, 0.4); }
.kp-drawer-btn--green { border-color: var(--neon-green); color: var(--neon-green); }
.kp-drawer-btn--green:hover { background: rgba(0, 255, 159, 0.12); box-shadow: 0 0 8px rgba(0, 255, 159, 0.4); }
.kp-drawer-btn--magenta { border-color: var(--neon-magenta); color: var(--neon-magenta); }
.kp-drawer-btn--magenta:hover { background: rgba(255, 46, 151, 0.12); box-shadow: 0 0 8px rgba(255, 46, 151, 0.4); }
.kp-drawer-btn--yellow { border-color: var(--neon-yellow); color: var(--neon-yellow); }
.kp-drawer-btn--yellow:hover { background: rgba(255, 247, 0, 0.12); box-shadow: 0 0 8px rgba(255, 247, 0, 0.4); }

.kp-drawer-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
