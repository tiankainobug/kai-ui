<script setup lang="ts">
import { ref } from 'vue'
import Loading from '@/components/Loading.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 全屏加载:点击后展示 1.6 秒
const fullscreen_visible = ref(false)
const show_fullscreen = () => {
  fullscreen_visible.value = true
  setTimeout(() => { fullscreen_visible.value = false }, 1600)
}

// 局部加载:持续展示
const inline_visible = ref(true)

// 指令式:切换容器加载状态
const directive_loading = ref(false)
const toggle_directive = () => {
  directive_loading.value = true
  setTimeout(() => { directive_loading.value = false }, 1800)
}

const loading_code = `<!-- 全屏 -->
<KpLoading fullscreen text="加载中" color="cyan" />

<!-- 局部:放置在 position:relative 容器内 -->
<div style="position:relative; height:120px">
  <KpLoading v-if="loading" text="同步中" type="dots" color="green" />
</div>

<!-- 指令式 -->
<div v-loading="loading">内容区</div>`

const loading_props: Record<string, string>[] = [
  { prop: 'type', desc: '指示器样式', type: 'String', default: 'ring', options: 'ring / dots / bars' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'fullscreen', desc: '全屏覆盖', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'text', desc: '加载文字', type: 'String', default: "''", options: '-' }
]
const loading_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const loading_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]

const directive_rows: Record<string, string>[] = [
  { prop: 'v-loading', desc: '指令式加载遮罩', type: 'Boolean / String', default: '-', options: 'true/false 或文字' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">加载 / LOADING</h2>

    <Loading v-if="fullscreen_visible" fullscreen text="同步数据流" type="ring" color="cyan" />

    <div class="kp-demo">
      <div>
        <span class="kp-label">类型</span>
        <div class="kp-loading-row">
          <div class="kp-loading-box"><Loading type="ring" /></div>
          <div class="kp-loading-box"><Loading type="dots" /></div>
          <div class="kp-loading-box"><Loading type="bars" /></div>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-loading-row">
          <div class="kp-loading-box"><Loading type="ring" color="cyan" /></div>
          <div class="kp-loading-box"><Loading type="ring" color="magenta" /></div>
          <div class="kp-loading-box"><Loading type="ring" color="green" /></div>
          <div class="kp-loading-box"><Loading type="ring" color="yellow" /></div>
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-loading-row">
          <div class="kp-loading-box"><Loading type="bars" size="sm" /></div>
          <div class="kp-loading-box"><Loading type="bars" size="md" /></div>
          <div class="kp-loading-box"><Loading type="bars" size="lg" /></div>
        </div>
      </div>

      <div>
        <span class="kp-label">全屏</span>
        <div class="kp-loading-row">
          <button class="kp-loading-btn" @click="show_fullscreen">显示全屏加载</button>
          <span class="kp-loading-tip">点击后全屏覆盖 1.6 秒</span>
        </div>
      </div>

      <div>
        <span class="kp-label">局部</span>
        <div class="kp-loading-inline">
          <div class="kp-loading-content">
            <p>&gt; 节点:NIGHT_CITY_07</p>
            <p>&gt; 状态:同步中...</p>
            <p>&gt; 进度:63%</p>
          </div>
          <Loading v-if="inline_visible" type="dots" color="green" text="同步中" />
        </div>
      </div>

      <div>
        <span class="kp-label">指令</span>
        <div class="kp-loading-inline">
          <div v-loading="directive_loading" class="kp-loading-content">
            <p>&gt; 此容器使用 v-loading 指令</p>
            <p>&gt; 点击下方按钮触发加载</p>
            <p>&gt; 加载状态会覆盖容器内容</p>
          </div>
        </div>
        <button class="kp-loading-btn" @click="toggle_directive">v-loading 触发</button>
      </div>
    </div>

    <CodeBlock :code="loading_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="loading_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="loading_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="loading_events" />
      <ApiTable title="指令" :columns="props_columns" :rows="directive_rows" />
    </div>
  </section>
</template>

<style scoped>
.kp-loading-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md);
  align-items: center;
}

.kp-loading-box {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-panel);
}

.kp-loading-inline {
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-panel);
  overflow: hidden;
}

.kp-loading-content {
  padding: var(--space-lg);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.8;
  min-height: 80px;
}

.kp-loading-btn {
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
.kp-loading-btn:hover { background: rgba(0, 240, 255, 0.12); box-shadow: 0 0 8px rgba(0, 240, 255, 0.4); }

.kp-loading-tip {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}
</style>
