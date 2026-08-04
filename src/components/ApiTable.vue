<script setup lang="ts">
// 通用 API 文档表格:接收标题、列定义、行数据,渲染赛博朋克风格表格
interface Column {
  key: string
  label: string
}

defineProps<{
  title: string
  columns: Column[]
  rows: Record<string, string>[]
}>()
</script>

<template>
  <div class="api-table">
    <div class="api-table__title">{{ title }}</div>
    <div class="api-table__scroll">
      <table class="api-table__table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">{{ col.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in rows" :key="i">
            <td v-for="col in columns" :key="col.key" :class="`api-table__cell--${col.key}`">
              {{ row[col.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.api-table {
  margin-bottom: var(--space-md);
}

.api-table__title {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--neon-cyan);
  text-transform: uppercase;
}
.api-table__title::before {
  content: '▸';
  text-shadow: 0 0 6px var(--neon-cyan);
}

.api-table__scroll {
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.api-table__table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-input);
  font-family: var(--font-mono);
  font-size: 13px;
}

.api-table__table th {
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text-secondary);
  background: rgba(0, 240, 255, 0.05);
  border-bottom: 1px solid var(--neon-cyan);
  box-shadow: 0 1px 6px rgba(0, 240, 255, 0.15);
  white-space: nowrap;
}

.api-table__table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  transition: background var(--transition-fast);
  white-space: nowrap;
}
.api-table__table tbody tr:last-child td {
  border-bottom: none;
}
.api-table__table tbody tr:hover td {
  background: rgba(0, 240, 255, 0.05);
}

/* 列高亮:属性名/插槽名/事件名 -> 青 */
.api-table__cell--prop,
.api-table__cell--name {
  color: var(--neon-cyan);
  font-weight: 600;
}

/* 类型/参数 -> 绿 */
.api-table__cell--type,
.api-table__cell--param {
  color: var(--neon-green);
}

/* 默认值 -> 黄 */
.api-table__cell--default {
  color: var(--neon-yellow);
}

/* 可选值 -> 品红 */
.api-table__cell--options {
  color: var(--neon-magenta);
}
</style>
