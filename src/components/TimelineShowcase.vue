<script setup lang="ts">
import Timeline from '@/components/Timeline.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const events_data = [
  { time: '23:42', title: '建立连接', description: '与 NIGHT_CITY_07 节点握手成功', color: 'cyan' as const },
  { time: '23:44', title: '身份验证', description: '神经签名校验通过', color: 'cyan' as const },
  { time: '23:47', title: 'ICE 追踪', description: '检测到敌方反追踪,启动规避', color: 'yellow' as const, icon: '!' },
  { time: '23:49', title: '连接中断', description: '信号被截获,链路强制断开', color: 'red' as const, icon: '✕' },
  { time: '23:52', title: '切换备用通道', description: '已通过中继节点恢复连接', color: 'green' as const, icon: '✓' }
]

const simple_data = [
  { time: '08:00', title: '系统启动' },
  { time: '12:00', title: '数据同步' },
  { time: '18:00', title: '日志归档' }
]

const timeline_code = `<KpTimeline :items="items" color="cyan" />

<!-- 单项自定义颜色 + 图标 -->
<KpTimeline :items="[
  { time: '10:00', title: '完成', color: 'green', icon: '✓' },
  { time: '11:00', title: '失败', color: 'red', icon: '✕' }
]" />`

const timeline_props: Record<string, string>[] = [
  { prop: 'items', desc: '时间线数据', type: 'Array<{ time, title, description?, color?, icon? }>', default: '[]', options: '-' },
  { prop: 'color', desc: '默认霓虹色(单项未指定时回退)', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' }
]
const timeline_slots: Record<string, string>[] = [
  { name: '-', desc: '暂无插槽' }
]
const timeline_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">时间线 / TIMELINE</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">事件流</span>
        <div class="kp-timeline-wrap">
          <Timeline :items="events_data" color="cyan" />
        </div>
      </div>

      <div>
        <span class="kp-label">简洁</span>
        <div class="kp-timeline-wrap">
          <Timeline :items="simple_data" color="green" />
        </div>
      </div>

      <div>
        <span class="kp-label">默认色</span>
        <div class="kp-timeline-wrap">
          <Timeline :items="simple_data" color="magenta" />
        </div>
      </div>
    </div>

    <CodeBlock :code="timeline_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="timeline_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="timeline_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="timeline_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-timeline-wrap {
  max-width: 460px;
}
</style>
