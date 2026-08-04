<script setup lang="ts">
import Avatar from '@/components/Avatar.vue'
import Badge from '@/components/Badge.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 模拟头像图片(用占位图,加载失败会回退文字)
const avatar_src = 'https://placehold.co/100/07070d/00f0ff?text=V'

const avatar_code = `<!-- 图片 -->
<KpAvatar src="/user.png" shape="circle" />

<!-- 文字 -->
<KpAvatar text="VK" color="cyan" />

<!-- 图标 -->
<KpAvatar icon="●" shape="square" color="green" />

<!-- 叠加徽标 -->
<KpAvatar src="/user.png">
  <template #badge>
    <KpBadge is-dot color="green" />
  </template>
</KpAvatar>`

const avatar_props: Record<string, string>[] = [
  { prop: 'src', desc: '图片地址', type: 'String', default: "''", options: '-' },
  { prop: 'text', desc: '文字(取前2字符)', type: 'String', default: "''", options: '-' },
  { prop: 'icon', desc: '图标字符', type: 'String', default: "''", options: '-' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'shape', desc: '形状', type: 'String', default: 'circle', options: 'circle / square' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' },
  { prop: 'bordered', desc: '霓虹边框发光', type: 'Boolean', default: 'true', options: '-' }
]
const avatar_slots: Record<string, string>[] = [
  { name: 'badge', desc: '叠加徽标(配合 Badge 组件)' }
]
const avatar_events: Record<string, string>[] = [
  { name: '-', desc: '暂无事件' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">头像 / AVATAR</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">类型</span>
        <div class="kp-avatar-row">
          <Avatar :src="avatar_src" shape="circle" />
          <Avatar text="VK" color="cyan" />
          <Avatar text="夜" color="magenta" />
          <Avatar icon="●" shape="square" color="green" />
          <Avatar icon="✦" color="yellow" />
        </div>
      </div>

      <div>
        <span class="kp-label">形状</span>
        <div class="kp-avatar-row">
          <Avatar text="C" shape="circle" color="cyan" />
          <Avatar text="S" shape="square" color="cyan" />
          <Avatar text="C" shape="circle" color="green" />
          <Avatar text="S" shape="square" color="green" />
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-avatar-row">
          <Avatar text="SM" size="sm" />
          <Avatar text="MD" size="md" />
          <Avatar text="LG" size="lg" />
        </div>
      </div>

      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-avatar-row">
          <Avatar text="青" color="cyan" />
          <Avatar text="品" color="magenta" />
          <Avatar text="绿" color="green" />
          <Avatar text="黄" color="yellow" />
        </div>
      </div>

      <div>
        <span class="kp-label">叠加</span>
        <div class="kp-avatar-row">
          <Avatar text="VK" color="green">
            <template #badge>
              <Badge is_dot color="green" />
            </template>
          </Avatar>
          <Avatar text="NC" color="cyan">
            <template #badge>
              <Badge :value="3" color="red" />
            </template>
          </Avatar>
          <Avatar text="DG" color="magenta">
            <template #badge>
              <Badge is_dot color="red" />
            </template>
          </Avatar>
        </div>
      </div>

      <div>
        <span class="kp-label">组合</span>
        <div class="kp-avatar-list">
          <Avatar text="VK" size="sm" color="cyan" />
          <Avatar text="NC" size="sm" color="magenta" />
          <Avatar text="DG" size="sm" color="green" />
          <Avatar text="+" size="sm" color="yellow" :bordered="false" />
        </div>
      </div>
    </div>

    <CodeBlock :code="avatar_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="avatar_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="avatar_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="avatar_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-avatar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-md);
}

.kp-avatar-list {
  display: flex;
}
.kp-avatar-list > * {
  margin-left: -8px;
  border: 2px solid var(--bg-panel);
}
.kp-avatar-list > *:first-child {
  margin-left: 0;
}
</style>
