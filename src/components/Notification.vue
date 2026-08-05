<script setup lang="ts">
import { notification_list, notification, type NotificationType } from './notification'

const icons: Record<NotificationType, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '✕'
}
</script>

<template>
  <Teleport to="body">
    <div class="kp-notification-wrap">
      <TransitionGroup name="kp-notification">
        <div
          v-for="item in notification_list"
          :key="item.id"
          class="kp-notification"
          :class="`kp-notification--${item.type}`"
        >
          <span class="kp-notification__icon">{{ icons[item.type] }}</span>
          <div class="kp-notification__main">
            <div class="kp-notification__title">{{ item.title }}</div>
            <div v-if="item.content" class="kp-notification__content">{{ item.content }}</div>
          </div>
          <button class="kp-notification__close" @click="notification.remove(item.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
/* 右上角堆叠容器 */
.kp-notification-wrap {
  position: fixed;
  top: var(--space-lg);
  right: var(--space-lg);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  width: 320px;
  max-width: 90vw;
  pointer-events: none;
}

.kp-notification {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-md);
  border: 1px solid var(--kp-c);
  border-left: 3px solid var(--kp-c);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  backdrop-filter: blur(6px);
  font-family: var(--font-mono);
  box-shadow: var(--kp-c-glow), 0 6px 20px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

/* 类型配色 */
.kp-notification--info    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-notification--success { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-notification--warning { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }
.kp-notification--error   { --kp-c: var(--neon-red);     --kp-c-glow: var(--glow-red); }

/* 图标 */
.kp-notification__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--kp-c);
  color: var(--bg-base);
  font-size: 12px;
  font-weight: 700;
  font-style: italic;
}

/* 主体 */
.kp-notification__main {
  flex: 1;
  min-width: 0;
}
.kp-notification__title {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--kp-c);
  text-shadow: 0 0 5px var(--kp-c);
}
.kp-notification__content {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 关闭 */
.kp-notification__close {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: color var(--transition-fast);
}
.kp-notification__close:hover { color: var(--text-primary); }

/* 出入动画:从右侧滑入 */
.kp-notification-enter-active,
.kp-notification-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}
.kp-notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.kp-notification-leave-to {
  opacity: 0;
  transform: translateX(120%);
}
.kp-notification-move {
  transition: transform var(--transition-base);
}
</style>
