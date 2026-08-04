<script setup lang="ts">
import { ref } from 'vue'
import Skeleton from '@/components/Skeleton.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 模拟加载切换
const loading = ref(true)
const toggle = () => { loading.value = !loading.value }

const skeleton_code = `<!-- 文本占位(多行) -->
<KpSkeleton type="text" :rows="3" />

<!-- 圆形(头像) -->
<KpSkeleton type="circle" :width="48" />

<!-- 矩形 -->
<KpSkeleton type="rect" :width="200" :height="120" />

<!-- 组合:卡片骨架 -->
<div class="card" v-if="loading">
  <KpSkeleton type="text" :width="'60%'" />
  <KpSkeleton type="rect" :height="80" />
  <KpSkeleton type="text" :rows="2" />
</div>`

const skeleton_props: Record<string, string>[] = [
  { prop: 'type', desc: '形状', type: 'String', default: 'text', options: 'text / circle / rect' },
  { prop: 'width', desc: '宽度', type: 'Number / String', default: "'100%'", options: '-' },
  { prop: 'height', desc: '高度', type: 'Number / String', default: '14', options: '-' },
  { prop: 'rows', desc: '行数(text 类型)', type: 'Number', default: '1', options: '-' },
  { prop: 'animated', desc: '流光动画', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' }
]
const skeleton_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const skeleton_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">骨架屏 / SKELETON</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">形状</span>
        <div class="kp-skeleton-shapes">
          <div class="kp-skeleton-shape">
            <span class="kp-skeleton-label">text</span>
            <Skeleton type="text" :rows="3" />
          </div>
          <div class="kp-skeleton-shape">
            <span class="kp-skeleton-label">circle</span>
            <Skeleton type="circle" :width="56" />
          </div>
          <div class="kp-skeleton-shape">
            <span class="kp-skeleton-label">rect</span>
            <Skeleton type="rect" :width="180" :height="80" />
          </div>
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-skeleton-shapes">
          <div class="kp-skeleton-shape"><Skeleton type="rect" :width="100" :height="40" color="cyan" /></div>
          <div class="kp-skeleton-shape"><Skeleton type="rect" :width="100" :height="40" color="magenta" /></div>
          <div class="kp-skeleton-shape"><Skeleton type="rect" :width="100" :height="40" color="green" /></div>
          <div class="kp-skeleton-shape"><Skeleton type="rect" :width="100" :height="40" color="yellow" /></div>
        </div>
      </div>

      <div>
        <span class="kp-label">组合</span>
        <div class="kp-skeleton-cards">
          <!-- 卡片骨架 -->
          <div class="kp-skeleton-card">
            <div class="kp-skeleton-card-head">
              <Skeleton type="circle" :width="40" />
              <div class="kp-skeleton-card-info">
                <Skeleton type="text" :width="'50%'" :height="12" />
                <Skeleton type="text" :width="'30%'" :height="10" />
              </div>
            </div>
            <Skeleton type="rect" :width="'100%'" :height="100" />
            <Skeleton type="text" :rows="2" />
          </div>
          <!-- 列表骨架 -->
          <div class="kp-skeleton-card">
            <div class="kp-skeleton-card-head">
              <Skeleton type="text" :width="'40%'" :height="14" />
            </div>
            <div v-for="i in 4" :key="i" class="kp-skeleton-list-row">
              <Skeleton type="circle" :width="24" />
              <Skeleton type="text" :width="`${60 + i * 5}%`" :height="12" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <span class="kp-label">交互</span>
        <div class="kp-skeleton-toggle">
          <button class="kp-skeleton-btn" @click="toggle">{{ loading ? '加载完成' : '重新加载' }}</button>
          <div class="kp-skeleton-toggle-content">
            <template v-if="loading">
              <Skeleton type="text" :width="'40%'" :height="16" />
              <Skeleton type="rect" :width="'100%'" :height="60" />
              <Skeleton type="text" :rows="2" />
            </template>
            <template v-else>
              <h3 class="kp-skeleton-loaded-title">节点信息</h3>
              <div class="kp-skeleton-loaded-body">系统运行正常,所有节点在线。</div>
              <p class="kp-skeleton-loaded-desc">延迟 0.3ms ｜ 带宽 1.2Tbps ｜ 加密 AES-512</p>
            </template>
          </div>
        </div>
      </div>
    </div>

    <CodeBlock :code="skeleton_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="skeleton_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="skeleton_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="skeleton_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-skeleton-shapes {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-lg);
  align-items: flex-start;
}
.kp-skeleton-shape {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  min-width: 180px;
}
.kp-skeleton-label {
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.kp-skeleton-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-md);
}

.kp-skeleton-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-panel);
}
.kp-skeleton-card-head {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.kp-skeleton-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.kp-skeleton-list-row {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.kp-skeleton-toggle {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.kp-skeleton-toggle-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-width: 400px;
}

.kp-skeleton-btn {
  align-self: flex-start;
  padding: 6px 16px;
  border: 1px solid var(--neon-cyan);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-skeleton-btn:hover { background: rgba(0, 240, 255, 0.12); box-shadow: 0 0 8px rgba(0, 240, 255, 0.4); }

.kp-skeleton-loaded-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--neon-cyan);
  text-shadow: 0 0 5px var(--neon-cyan);
}
.kp-skeleton-loaded-body {
  padding: var(--space-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--text-secondary);
  font-size: 13px;
}
.kp-skeleton-loaded-desc {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 0.5px;
}
</style>
