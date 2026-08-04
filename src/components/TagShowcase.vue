<script setup lang="ts">
import { ref, computed } from 'vue'
import Tag from '@/components/Tag.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 可勾选交互
const picked = ref(true)

// 可关闭:动态标签列表
const tags = ref([
  { label: '赛博', color: 'cyan' as const },
  { label: '朋克', color: 'magenta' as const },
  { label: '终端', color: 'green' as const },
  { label: '协议', color: 'yellow' as const }
])
const remove_tag = (i: number) => { tags.value.splice(i, 1) }
const remaining = computed(() => tags.value.length)

const tag_code = `<KpTag label="CYBER" color="cyan" />

<!-- 实色风格 -->
<KpTag label="DANGER" color="red" type="solid" />

<!-- 可勾选(配合 v-model) -->
<KpTag v-model="picked" label="可选" color="green" checkable />

<!-- 可关闭 -->
<KpTag label="可移除" color="magenta" closable @close="onClose" />`

const tag_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '勾选态(配合 v-model,需 checkable)', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'label', desc: '标签文字', type: 'String', default: "''", options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow / purple / red' },
  { prop: 'size', desc: '尺寸', type: 'String', default: 'md', options: 'sm / md / lg' },
  { prop: 'type', desc: '风格', type: 'String', default: 'default', options: 'default / outline / solid' },
  { prop: 'checkable', desc: '是否可勾选', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'closable', desc: '是否可关闭', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'disabled', desc: '禁用', type: 'Boolean', default: 'false', options: '-' }
]
const tag_slots: Record<string, string>[] = [
  { name: 'default', desc: '标签内容(传入则覆盖 label)' }
]
const tag_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '勾选态变化(配合 v-model)', param: '(value: Boolean)' },
  { name: 'change', desc: '勾选态变化时触发', param: '(value: Boolean)' },
  { name: 'close', desc: '关闭按钮点击时触发', param: '-' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">标签 / TAG</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">颜色</span>
        <div class="kp-row">
          <Tag label="CYAN" color="cyan" />
          <Tag label="MAGENTA" color="magenta" />
          <Tag label="GREEN" color="green" />
          <Tag label="YELLOW" color="yellow" />
          <Tag label="PURPLE" color="purple" />
          <Tag label="RED" color="red" />
        </div>
      </div>

      <div>
        <span class="kp-label">风格</span>
        <div class="kp-row">
          <Tag label="默认" color="cyan" type="default" />
          <Tag label="描边" color="magenta" type="outline" />
          <Tag label="实色" color="green" type="solid" />
          <Tag label="实色" color="red" type="solid" />
        </div>
      </div>

      <div>
        <span class="kp-label">尺寸</span>
        <div class="kp-row">
          <Tag label="SMALL" size="sm" />
          <Tag label="MEDIUM" size="md" />
          <Tag label="LARGE" size="lg" />
        </div>
      </div>

      <div>
        <span class="kp-label">可勾选</span>
        <div class="kp-row">
          <Tag v-model="picked" label="神经接口" color="cyan" checkable />
          <Tag :model-value="true" label="已启用" color="green" checkable />
          <Tag :model-value="false" label="未启用" color="magenta" checkable />
        </div>
      </div>

      <div>
        <span class="kp-label">可关闭</span>
        <div class="kp-row">
          <Tag
            v-for="(t, i) in tags"
            :key="t.label"
            :label="t.label"
            :color="t.color"
            closable
            @close="remove_tag(i)"
          />
          <span v-if="remaining === 0" class="preview__echo">&gt; 已全部移除</span>
        </div>
      </div>

      <div>
        <span class="kp-label">状态</span>
        <div class="kp-row">
          <Tag label="禁用" color="cyan" disabled />
          <Tag :model-value="true" label="禁用(勾选)" color="green" checkable disabled />
          <Tag label="禁用可关" color="red" closable disabled />
        </div>
      </div>

      <div>
        <span class="kp-label">交互</span>
        <div class="kp-tag-stack">
          <Tag v-model="picked" label="切换我" color="yellow" checkable size="lg" />
          <p class="preview__echo">&gt; 当前状态:{{ picked ? '已勾选' : '未勾选' }}</p>
        </div>
      </div>
    </div>

    <CodeBlock :code="tag_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="tag_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="tag_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="tag_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-tag-stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
