<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="kp-app">
    <!-- 顶部导航栏 -->
    <header class="kp-header">
      <div class="kp-header__brand">
        <span class="kp-header__logo">◆</span>
        <span class="kp-header__name">KAI<span class="kp-header__accent">_UI</span></span>
      </div>
      <nav class="kp-header__nav">
        <RouterLink to="/intro" class="kp-header__link">// 介绍</RouterLink>
        <RouterLink to="/preview" class="kp-header__link">// 预览</RouterLink>
      </nav>
      <div class="kp-header__status">
        <span class="kp-header__dot"></span> SYS::ONLINE
      </div>
    </header>

    <!-- 页面出口 -->
    <main class="kp-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.kp-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.kp-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-xl);
  background: rgba(15, 15, 26, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  /* 底部霓虹高光线 */
  box-shadow: 0 1px 0 var(--neon-cyan), 0 0 12px rgba(0, 240, 255, 0.3);
}

.kp-header__brand {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-weight: 700;
  font-size: 18px;
  letter-spacing: 2px;
}

.kp-header__logo {
  color: var(--neon-cyan);
  text-shadow: 0 0 8px var(--neon-cyan);
  animation: kp-pulse 2s infinite;
}

.kp-header__accent {
  color: var(--neon-magenta);
  text-shadow: 0 0 8px var(--neon-magenta);
}

.kp-header__nav {
  display: flex;
  gap: var(--space-lg);
}

.kp-header__link {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 14px;
  letter-spacing: 1px;
  transition: color var(--transition-fast), text-shadow var(--transition-fast);
}

.kp-header__link:hover {
  color: var(--neon-cyan);
  text-shadow: 0 0 8px var(--neon-cyan);
}

.kp-header__link.router-link-active {
  color: var(--neon-cyan);
  text-shadow: 0 0 8px var(--neon-cyan);
}

.kp-header__status {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}

.kp-header__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--neon-green);
  box-shadow: 0 0 8px var(--neon-green);
  animation: kp-pulse 1.5s infinite;
}

.kp-main {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
}

@media (max-width: 640px) {
  .kp-header__status { display: none; }
  .kp-header { padding: var(--space-md); }
  .kp-header__nav { gap: var(--space-md); }
  .kp-main { padding: var(--space-lg) var(--space-md); }
}
</style>
