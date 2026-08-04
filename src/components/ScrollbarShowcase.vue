<script setup lang="ts">
import { ref } from 'vue'
import Scrollbar from '@/components/Scrollbar.vue'
import Button from '@/components/Button.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, events_columns } from '@/data/api-columns'

// 滚动控制演示:引用组件实例调用 scrollTo 系列方法
const scrollbar_ref = ref<InstanceType<typeof Scrollbar> | null>(null)

// 滚动事件回显
const scroll_progress = ref(0)
const reach_bottom_log = ref<string[]>([])
const on_scroll = (payload: { ratioY: number }) => {
  scroll_progress.value = Math.round(payload.ratioY * 100)
}
const on_reach_bottom = (scrollTop: number) => {
  reach_bottom_log.value.unshift(`REACH_BOTTOM · scrollTop=${scrollTop}`)
  if (reach_bottom_log.value.length > 3) reach_bottom_log.value.pop()
}

// 长文本内容(制造纵向溢出)
const paragraph = '夜之城,2077.霓虹倒映在积水的路面,全息广告在摩天楼间穿行,数据流如雨水般倾泻而下,渗透进每一个未加密的终端.你的意识接入网络,在冰与火之间寻找那个丢失的协议.'
const long_text = Array.from({ length: 12 }, () => paragraph).join('\n\n')

// 颜色/显隐演示文本:3 段确保超过 max_height,触发滚动条显示
const color_text = Array.from({ length: 3 }, () => paragraph).join('\n\n')

// 横向滚动:一组定宽卡片
const h_cards = Array.from({ length: 8 }, (_, i) => `节点_0x${(i * 17).toString(16).toUpperCase().padStart(4, '0')}`)

const usage_code = `<KpScrollbar :max_height="200" thumb_color="cyan">
  <p>长内容...</p>
</KpScrollbar>

<!-- 常驻 + 横向 -->
<KpScrollbar always_visible horizontal thumb_color="magenta">
  <div style="width: 800px;">宽内容</div>
</KpScrollbar>

<!-- 滚动控制 + 事件 -->
<KpScrollbar
  ref="sb"
  :max_height="200"
  @scroll="onScroll"
  @reach_bottom="onReachBottom"
/>
<script setup>
sb.value.scroll_to_top()
sb.value.scroll_to_bottom()
<\/script>`

// API 表格数据
const props_rows: Record<string, string>[] = [
  { prop: 'height', desc: '容器固定高度', type: 'String / Number', default: "'auto'", options: '任意 CSS 高度' },
  { prop: 'max_height', desc: '最大高度,内容超出才滚动', type: 'String / Number', default: '300', options: '-' },
  { prop: 'always_visible', desc: '滚动条常驻显示(否则淡入淡出)', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'thumb_color', desc: '滚动条霓虹色', type: 'String', default: "'cyan'", options: 'cyan / magenta / green / yellow / purple' },
  { prop: 'horizontal', desc: '启用横向滚动', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'smooth', desc: '平滑滚动(scrollTo 行为)', type: 'Boolean', default: 'true', options: '-' }
]
const events_rows: Record<string, string>[] = [
  { name: 'scroll', desc: '滚动时触发', param: '({ scrollTop, scrollLeft, ratioY, ratioX })' },
  { name: 'reach_bottom', desc: '滚动触底时触发(去重)', param: '(scrollTop: Number)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">滚动条 / SCROLLBAR</h2>

    <!-- 基础用法 -->
    <div class="kp-demo">
      <div>
        <span class="kp-label">基础</span>
        <Scrollbar :max_height="200" thumb_color="cyan">
          <div class="sb-content">
            <pre class="sb-content__text">{{ long_text }}</pre>
          </div>
        </Scrollbar>
      </div>
    </div>

    <!-- 颜色变体 -->
    <div class="kp-demo">
      <div>
        <span class="kp-label">颜色</span>
        <div class="sb-color-grid">
          <Scrollbar :max_height="140" thumb_color="cyan">
            <div class="sb-content"><p class="sb-content__text">{{ color_text }}</p></div>
          </Scrollbar>
          <Scrollbar :max_height="140" thumb_color="magenta">
            <div class="sb-content"><p class="sb-content__text">{{ color_text }}</p></div>
          </Scrollbar>
          <Scrollbar :max_height="140" thumb_color="green">
            <div class="sb-content"><p class="sb-content__text">{{ color_text }}</p></div>
          </Scrollbar>
        </div>
      </div>
    </div>

    <!-- 自动隐藏 vs 常驻 -->
    <div class="kp-demo">
      <div>
        <span class="kp-label">显隐</span>
        <div class="sb-color-grid">
          <Scrollbar :max_height="140">
            <div class="sb-content"><p class="sb-content__hint">默认:停止滚动后淡出</p><p class="sb-content__text">{{ color_text }}</p></div>
          </Scrollbar>
          <Scrollbar :max_height="140" always_visible>
            <div class="sb-content"><p class="sb-content__hint">常驻:always_visible</p><p class="sb-content__text">{{ color_text }}</p></div>
          </Scrollbar>
        </div>
      </div>
    </div>

    <!-- 横向滚动 -->
    <div class="kp-demo">
      <div>
        <span class="kp-label">横向</span>
        <Scrollbar :max_height="120" horizontal thumb_color="magenta">
          <div class="sb-htrack">
            <div v-for="c in h_cards" :key="c" class="sb-hcard">{{ c }}</div>
          </div>
        </Scrollbar>
      </div>
    </div>

    <!-- 滚动控制 + 事件回显 -->
    <div class="kp-demo">
      <div>
        <span class="kp-label">控制</span>
        <div class="sb-control">
          <div class="sb-control__btns">
            <Button size="sm" @click="scrollbar_ref?.scroll_to_top()">置顶 ↑</Button>
            <Button size="sm" variant="secondary" @click="scrollbar_ref?.scroll_to_bottom()">置底 ↓</Button>
            <span class="sb-control__progress">&gt; 进度:{{ scroll_progress }}%</span>
          </div>
          <Scrollbar
            ref="scrollbar_ref"
            :max_height="180"
            thumb_color="green"
            @scroll="on_scroll"
            @reach_bottom="on_reach_bottom"
          >
            <div class="sb-content"><pre class="sb-content__text">{{ long_text }}</pre></div>
          </Scrollbar>
          <div class="sb-control__log">
            <span v-if="reach_bottom_log.length" class="sb-control__log-line">{{ reach_bottom_log[0] }}</span>
            <span v-else class="sb-control__log-hint">&gt; 滚动到底部将触发 reach_bottom 事件</span>
          </div>
        </div>
      </div>
    </div>

    <CodeBlock :code="usage_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="props_rows" />
      <ApiTable title="Events" :columns="events_columns" :rows="events_rows" />
    </div>
  </section>
</template>

<style scoped>
.sb-content {
  padding: var(--space-md);
}

.sb-content__text {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-secondary);
  white-space: pre-wrap;
  word-break: break-word;
}

.sb-content__hint {
  margin-bottom: var(--space-sm);
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--neon-cyan);
}

/* 颜色/显隐对比网格 */
.sb-color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-md);
}

/* 横向滚动轨道 */
.sb-htrack {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-md);
  width: max-content;
}

.sb-hcard {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 70px;
  flex-shrink: 0;
  background: rgba(255, 46, 151, 0.08);
  border: 1px solid var(--neon-magenta);
  color: var(--neon-magenta);
  font-size: 12px;
  letter-spacing: 1px;
  clip-path: polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px);
}

/* 控制演示区 */
.sb-control {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.sb-control__btns {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.sb-control__progress {
  margin-left: var(--space-sm);
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--neon-green);
}

.sb-control__log {
  min-height: 20px;
  font-size: 12px;
  letter-spacing: 1px;
}

.sb-control__log-line {
  color: var(--neon-yellow);
}

.sb-control__log-hint {
  color: var(--text-muted);
}
</style>
