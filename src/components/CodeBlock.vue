<script setup lang="ts">
// 代码片段展示块:接收字符串代码,原样渲染(避免模板转义问题)
defineProps<{ code: string }>()
</script>

<template>
  <pre class="kp-code"><code>{{ code }}</code></pre>
</template>

<style scoped>
.kp-code {
  margin: 0;
  padding: var(--space-md);
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  border-left: 2px solid var(--neon-cyan);
  border-radius: var(--radius-sm);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-secondary);
  white-space: pre;
}
</style>
