<script setup lang="ts">
import { message_list, message, type MessageType } from './message'

// 各类型图标标识
const icons: Record<MessageType, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '✕'
}
</script>

<template>
  <Teleport to="body">
    <div class="kp-message-wrap">
      <TransitionGroup name="kp-message">
        <div
          v-for="msg in message_list"
          :key="msg.id"
          class="kp-message"
          :class="`kp-message--${msg.type}`"
        >
          <span class="kp-message__icon">{{ icons[msg.type] }}</span>
          <span class="kp-message__text">{{ msg.text }}</span>
          <button class="kp-message__close" @click="message.remove(msg.id)">×</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
/* 顶部居中堆叠容器 */
.kp-message-wrap {
  position: fixed;
  top: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  pointer-events: none;
}

.kp-message {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-width: 260px;
  max-width: 80vw;
  padding: 10px var(--space-md);
  border: 1px solid var(--kp-c);
  border-radius: var(--radius-sm);
  background: var(--bg-elevated);
  backdrop-filter: blur(6px);
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-primary);
  box-shadow: var(--kp-c-glow), 0 6px 20px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

/* 类型配色 */
.kp-message--info    { --kp-c: var(--neon-cyan);    --kp-c-glow: var(--glow-cyan); }
.kp-message--success { --kp-c: var(--neon-green);   --kp-c-glow: var(--glow-green); }
.kp-message--warning { --kp-c: var(--neon-yellow);  --kp-c-glow: 0 0 7px #fff700, 0 0 14px rgba(255, 247, 0, 0.4); }
.kp-message--error   { --kp-c: var(--neon-red);     --kp-c-glow: var(--glow-red); }

/* 图标圆标 */
.kp-message__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--kp-c);
  color: var(--bg-base);
  font-size: 12px;
  font-weight: 700;
  font-style: italic;
}

.kp-message__text {
  flex: 1;
  letter-spacing: 0.5px;
  line-height: 1.4;
}

.kp-message__close {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: color var(--transition-fast);
}
.kp-message__close:hover { color: var(--text-primary); }

/* 出入动画:从顶部滑入 */
.kp-message-enter-active,
.kp-message-leave-active {
  transition: opacity var(--transition-base), transform var(--transition-base);
}
.kp-message-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}
.kp-message-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
/* 列表移动时平滑过渡 */
.kp-message-move {
  transition: transform var(--transition-base);
}
</style>
