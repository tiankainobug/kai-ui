<script setup lang="ts">
import Statistic from '@/components/Statistic.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 倒计时目标:当前时间 + 2 天 6 小时
const countdown_target = Date.now() + 2 * 86400000 + 6 * 3600000 + 42 * 60000

const statistic_code = `<KpStatistic title="在线节点" :value="1280" suffix="个" color="cyan" />

<!-- 前缀 + 小数 -->
<KpStatistic title="带宽" :value="1.24" :precision="2" prefix="↑" suffix="Tbps" color="green" />

<!-- 倒计时 -->
<KpStatistic title="维护倒计时" :countdown="target_ts" color="magenta" />`

const statistic_props: Record<string, string>[] = [
  { prop: 'value', desc: '数值', type: 'Number', default: '0', options: '-' },
  { prop: 'title', desc: '标题', type: 'String', default: "''", options: '-' },
  { prop: 'prefix', desc: '前缀', type: 'String', default: "''", options: '-' },
  { prop: 'suffix', desc: '后缀', type: 'String', default: "''", options: '-' },
  { prop: 'precision', desc: '小数位数', type: 'Number', default: '0', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow / red' },
  { prop: 'countdown', desc: '倒计时目标时间戳(ms)', type: 'Number', default: '0', options: '-' }
]
const statistic_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const statistic_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">统计数值 / STATISTIC</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">基础</span>
        <div class="kp-statistic-grid">
          <Statistic title="在线节点" :value="1280" suffix="个" color="cyan" />
          <Statistic title="活跃用户" :value="98421" color="green" />
          <Statistic title="告警数" :value="7" color="red" />
          <Statistic title="完成率" :value="99" suffix="%" color="yellow" />
        </div>
      </div>

      <div>
        <span class="kp-label">前后缀</span>
        <div class="kp-statistic-grid">
          <Statistic title="带宽" :value="1.24" :precision="2" prefix="↑" suffix="Tbps" color="cyan" />
          <Statistic title="延迟" :value="0.3" :precision="1" prefix="↓" suffix="ms" color="green" />
          <Statistic title="余额" :value="88420" prefix="¥" color="magenta" />
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-statistic-grid">
          <Statistic title="青" :value="100" color="cyan" />
          <Statistic title="品" :value="100" color="magenta" />
          <Statistic title="绿" :value="100" color="green" />
          <Statistic title="黄" :value="100" color="yellow" />
        </div>
      </div>

      <div>
        <span class="kp-label">倒计时</span>
        <div class="kp-statistic-grid">
          <Statistic title="系统维护" :countdown="countdown_target" color="magenta" />
          <Statistic title="协议续期" :countdown="Date.now() + 3 * 3600000" color="yellow" />
        </div>
        <p class="preview__echo">&gt; 倒计时每秒自动刷新</p>
      </div>
    </div>

    <CodeBlock :code="statistic_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="statistic_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="statistic_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="statistic_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-statistic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--space-lg);
}

.preview__echo {
  margin-top: var(--space-sm);
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
