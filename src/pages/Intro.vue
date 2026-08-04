<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'
import CodeBlock from '@/components/CodeBlock.vue'

const router = useRouter()
const go_preview = () => router.push('/preview')

const features = [
  { icon: '▰', title: '切角几何', desc: '基于 clip-path 的赛博切角边框,告别圆角单调感,硬朗工业风。' },
  { icon: '◆', title: '霓虹发光', desc: 'currentColor 驱动的 drop-shadow 发光体系,hover 即通电。' },
  { icon: 'M', title: 'JetBrains Mono', desc: '全站统一等宽字体,代码与界面共享同一种气质。' },
  { icon: '▣', title: '状态完备', desc: 'loading / disabled / error / clearable 等状态开箱即用。' }
]

const palette = [
  { name: 'neon-cyan', hex: '#00f0ff' },
  { name: 'neon-magenta', hex: '#ff2e97' },
  { name: 'neon-green', hex: '#00ff9f' },
  { name: 'neon-yellow', hex: '#fff700' },
  { name: 'neon-purple', hex: '#b026ff' },
  { name: 'neon-red', hex: '#ff003c' }
]

const install_code = `# 安装依赖并启动开发服务器
npm install
npm run dev`

const usage_code = `<template>
  <KpButton variant="primary" size="md">
    ENGAGE
  </KpButton>

  <KpInput
    v-model="value"
    placeholder="输入指令..."
    variant="glow"
    clearable
  />
</template>`
</script>

<template>
  <div class="intro">
    <!-- Hero 区 -->
    <section class="intro__hero">
      <p class="intro__tag">// CYBERPUNK_UI_COMPONENTS · v0.1.0</p>
      <h1 class="intro__title">KAI<span>_UI</span></h1>
      <p class="intro__desc">
        一套以赛博朋克为美学基调的 Vue 3 组件库。<br />
        霓虹、切角、扫描线、等宽字体——为未来界面而生。
      </p>
      <div class="intro__actions">
        <Button variant="primary" size="lg" @click="go_preview">查看预览 →</Button>
        <Button variant="ghost" size="lg">文档</Button>
      </div>
    </section>

    <!-- 特性 -->
    <section class="kp-section">
      <h2 class="kp-section__title">特性 / FEATURES</h2>
      <div class="intro__features">
        <div v-for="f in features" :key="f.title" class="intro__feature">
          <span class="intro__feature-icon">{{ f.icon }}</span>
          <h3 class="intro__feature-title">{{ f.title }}</h3>
          <p class="intro__feature-desc">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 配色 -->
    <section class="kp-section">
      <h2 class="kp-section__title">配色 / PALETTE</h2>
      <div class="intro__palette">
        <div v-for="c in palette" :key="c.name" class="intro__swatch">
          <span
            class="intro__swatch-color"
            :style="{ background: c.hex, boxShadow: `0 0 12px ${c.hex}` }"
          />
          <span class="intro__swatch-name">{{ c.name }}</span>
          <span class="intro__swatch-hex">{{ c.hex }}</span>
        </div>
      </div>
    </section>

    <!-- 快速上手 -->
    <section class="kp-section">
      <h2 class="kp-section__title">快速上手 / GETTING STARTED</h2>
      <p class="kp-section__subtitle">安装依赖并在项目中引入组件:</p>
      <CodeBlock :code="install_code" />
      <p class="kp-section__subtitle" style="margin-top: 24px;">基础用法:</p>
      <CodeBlock :code="usage_code" />
    </section>
  </div>
</template>

<style scoped>
.intro__hero {
  padding: var(--space-xl) 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--space-xl);
}

.intro__tag {
  color: var(--neon-green);
  font-size: 13px;
  letter-spacing: 2px;
  margin-bottom: var(--space-md);
}

.intro__title {
  font-size: clamp(48px, 10vw, 96px);
  font-weight: 800;
  letter-spacing: 4px;
  line-height: 1;
  color: var(--text-primary);
  margin-bottom: var(--space-md);
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
}
.intro__title span {
  color: var(--neon-magenta);
  text-shadow: 0 0 20px var(--neon-magenta);
}

.intro__desc {
  color: var(--text-secondary);
  font-size: 15px;
  max-width: 560px;
  margin-bottom: var(--space-lg);
}

.intro__actions {
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
}

/* 特性网格 */
.intro__features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: var(--space-md);
}

.intro__feature {
  padding: var(--space-lg);
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: border-color var(--transition-base), transform var(--transition-base);
}
.intro__feature:hover {
  border-color: var(--neon-cyan);
  transform: translateY(-2px);
}

.intro__feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-bottom: var(--space-md);
  background: rgba(0, 240, 255, 0.1);
  border: 1px solid var(--neon-cyan);
  color: var(--neon-cyan);
  font-size: 18px;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
}

.intro__feature-title {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: var(--space-xs);
  color: var(--text-primary);
}

.intro__feature-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 配色板 */
.intro__palette {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-md);
}

.intro__swatch {
  padding: var(--space-md);
  background: var(--bg-panel);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.intro__swatch-color {
  width: 100%;
  height: 48px;
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-xs);
}

.intro__swatch-name {
  font-size: 13px;
  color: var(--text-primary);
}

.intro__swatch-hex {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
