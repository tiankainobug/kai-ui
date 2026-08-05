<script setup lang="ts">
import Result from '@/components/Result.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const result_code = `<KpResult status="success" title="操作成功" description="数据已同步" />

<!-- 失败 + 操作 -->
<KpResult status="error" title="连接失败" description="节点无响应">
  <template #action>
    <button>重试</button>
  </template>
</KpResult>`

const result_props: Record<string, string>[] = [
  { prop: 'status', desc: '状态', type: 'String', default: 'info', options: 'success / error / info / warning' },
  { prop: 'title', desc: '标题', type: 'String', default: "''", options: '-' },
  { prop: 'description', desc: '描述', type: 'String', default: "''", options: '-' },
  { prop: 'color', desc: '霓虹色(状态未覆盖时)', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' }
]
const result_slots: Record<string, string>[] = [
  { name: 'default', desc: '描述内容(覆盖 description)' },
  { name: 'title', desc: '自定义标题(覆盖 title)' },
  { name: 'icon', desc: '自定义图标(覆盖默认 SVG)' },
  { name: 'action', desc: '底部操作区(如按钮)' }
]
const result_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">结果页 / RESULT</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">状态</span>
        <div class="kp-result-grid">
          <div class="kp-result-box">
            <Result status="success" title="操作成功" description="神经接口校准完成,延迟 0.3ms" />
          </div>
          <div class="kp-result-box">
            <Result status="error" title="连接失败" description="目标节点无响应,请检查网络">
              <template #action>
                <button class="kp-result-btn">重试</button>
                <button class="kp-result-btn kp-result-btn--ghost">返回</button>
              </template>
            </Result>
          </div>
          <div class="kp-result-box">
            <Result status="info" title="信息提示" description="系统将于 03:00 进行维护" />
          </div>
          <div class="kp-result-box">
            <Result status="warning" title="安全警告" description="检测到 ICE 追踪信号">
              <template #action>
                <button class="kp-result-btn">立即撤离</button>
              </template>
            </Result>
          </div>
        </div>
      </div>

      <div>
        <span class="kp-label">自定义</span>
        <div class="kp-result-grid">
          <div class="kp-result-box">
            <Result status="success" title="交易完成" description="¥ 88,420 已转入目标账户">
              <template #action>
                <button class="kp-result-btn">查看详情</button>
              </template>
            </Result>
          </div>
        </div>
      </div>
    </div>

    <CodeBlock :code="result_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="result_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="result_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="result_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-md);
}

.kp-result-box {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-panel);
  overflow: hidden;
}

.kp-result-btn {
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
.kp-result-btn:hover { background: rgba(0, 240, 255, 0.12); box-shadow: 0 0 8px rgba(0, 240, 255, 0.4); }
.kp-result-btn--ghost { border-color: var(--border-bright); color: var(--text-secondary); }
.kp-result-btn--ghost:hover { background: transparent; border-color: var(--text-secondary); }
</style>
