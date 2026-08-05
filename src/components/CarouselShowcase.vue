<script setup lang="ts">
import { ref } from 'vue'
import Carousel from '@/components/Carousel.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

const current = ref(0)

const carousel_code = `<KpCarousel :count="3" :interval="4000" color="cyan" height="280">
  <div class="slide">幻灯片 1</div>
  <div class="slide">幻灯片 2</div>
  <div class="slide">幻灯片 3</div>
</KpCarousel>`

const carousel_props: Record<string, string>[] = [
  { prop: 'count', desc: '幻灯片数量', type: 'Number', default: '0', options: '-' },
  { prop: 'autoplay', desc: '自动播放', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'interval', desc: '切换间隔(ms)', type: 'Number', default: '4000', options: '-' },
  { prop: 'loop', desc: '循环播放', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'height', desc: '高度', type: 'Number / String', default: '280', options: '-' },
  { prop: 'arrow', desc: '箭头显示', type: 'String', default: 'hover', options: 'always / hover / never' }
]
const carousel_slots: Record<string, string>[] = [
  { name: 'default', desc: '幻灯片内容(每项需 width:100%; flex-shrink:0)' }
]
const carousel_events: Record<string, string>[] = [
  { name: 'change', desc: '切换幻灯片时触发', param: '(index: Number)' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">轮播 / CAROUSEL</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">基础</span>
        <div class="kp-carousel-wrap">
          <Carousel :count="3" color="cyan" :height="240" @change="(i) => (current = i)">
            <div class="kp-carousel-slide kp-carousel-slide--cyan">
              <div class="kp-carousel-slide__tag">01</div>
              <h3 class="kp-carousel-slide__title">夜之城</h3>
              <p class="kp-carousel-slide__desc">霓虹永不熄灭</p>
            </div>
            <div class="kp-carousel-slide kp-carousel-slide--magenta">
              <div class="kp-carousel-slide__tag">02</div>
              <h3 class="kp-carousel-slide__title">新东京</h3>
              <p class="kp-carousel-slide__desc">数据洪流之地</p>
            </div>
            <div class="kp-carousel-slide kp-carousel-slide--green">
              <div class="kp-carousel-slide__tag">03</div>
              <h3 class="kp-carousel-slide__title">柏林矩阵</h3>
              <p class="kp-carousel-slide__desc">ICE 防线核心</p>
            </div>
          </Carousel>
          <p class="preview__echo">&gt; 当前:第 {{ current + 1 }} 张</p>
        </div>
      </div>

      <div>
        <span class="kp-label">自动播放</span>
        <div class="kp-carousel-wrap">
          <Carousel :count="4" :interval="2500" color="magenta" :height="160">
            <div class="kp-carousel-slide kp-carousel-slide--small">A</div>
            <div class="kp-carousel-slide kp-carousel-slide--small">B</div>
            <div class="kp-carousel-slide kp-carousel-slide--small">C</div>
            <div class="kp-carousel-slide kp-carousel-slide--small">D</div>
          </Carousel>
          <p class="kp-carousel-tip">间隔 2.5s 自动切换</p>
        </div>
      </div>

      <div>
        <span class="kp-label">箭头</span>
        <div class="kp-carousel-grid">
          <div>
            <span class="kp-carousel-label">always</span>
            <Carousel :count="2" arrow="always" :autoplay="false" color="green" :height="120">
              <div class="kp-carousel-slide kp-carousel-slide--small">1</div>
              <div class="kp-carousel-slide kp-carousel-slide--small">2</div>
            </Carousel>
          </div>
          <div>
            <span class="kp-carousel-label">never</span>
            <Carousel :count="2" arrow="never" :autoplay="false" color="yellow" :height="120">
              <div class="kp-carousel-slide kp-carousel-slide--small">1</div>
              <div class="kp-carousel-slide kp-carousel-slide--small">2</div>
            </Carousel>
          </div>
        </div>
      </div>
    </div>

    <CodeBlock :code="carousel_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="carousel_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="carousel_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="carousel_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-carousel-wrap {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-width: 520px;
}

/* 幻灯片:占满轨道宽度且不收缩 */
.kp-carousel-slide {
  width: 100%;
  flex-shrink: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
}
.kp-carousel-slide--cyan { background: linear-gradient(135deg, rgba(0,240,255,0.15), transparent), var(--bg-panel); }
.kp-carousel-slide--magenta { background: linear-gradient(135deg, rgba(255,46,151,0.15), transparent), var(--bg-panel); }
.kp-carousel-slide--green { background: linear-gradient(135deg, rgba(0,255,159,0.15), transparent), var(--bg-panel); }
.kp-carousel-slide--small { font-size: 32px; font-weight: 700; color: var(--text-secondary); }

.kp-carousel-slide__tag {
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--neon-cyan);
  opacity: 0.7;
}
.kp-carousel-slide__title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--text-primary);
}
.kp-carousel-slide__desc {
  font-size: 13px;
  color: var(--text-muted);
}

.kp-carousel-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  max-width: 520px;
}
.kp-carousel-label {
  display: block;
  margin-bottom: 4px;
  font-size: 11px;
  color: var(--text-muted);
  letter-spacing: 1px;
}

.kp-carousel-tip {
  font-size: 12px;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
