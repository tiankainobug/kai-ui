<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/Modal.vue'
import CodeBlock from '@/components/CodeBlock.vue'
import ApiTable from '@/components/ApiTable.vue'
import { props_columns, slots_columns, events_columns } from '@/data/api-columns'

// 各示例的开关状态
const basic_visible = ref(false)
const confirm_visible = ref(false)
const custom_visible = ref(false)
const result = ref('')

const modal_code = `<KpModal v-model="visible" title="系统警告" color="cyan">
  检测到非法入侵,是否终止连接?
  <template #footer>
    <button @click="visible = false">自定义按钮</button>
  </template>
</KpModal>`

const modal_props: Record<string, string>[] = [
  { prop: 'modelValue', desc: '是否显示(配合 v-model)', type: 'Boolean', default: 'false', options: '-' },
  { prop: 'title', desc: '标题', type: 'String', default: "''", options: '-' },
  { prop: 'width', desc: '宽度', type: 'Number / String', default: '440', options: '-' },
  { prop: 'confirm_text', desc: '确认按钮文字', type: 'String', default: '确认', options: '-' },
  { prop: 'cancel_text', desc: '取消按钮文字', type: 'String', default: '取消', options: '-' },
  { prop: 'show_confirm', desc: '显示确认按钮', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'show_cancel', desc: '显示取消按钮', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'show_close', desc: '显示关闭图标', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'mask_closable', desc: '点击遮罩可关闭', type: 'Boolean', default: 'true', options: '-' },
  { prop: 'color', desc: '霓虹色', type: 'String', default: 'cyan', options: 'cyan / magenta / green / yellow' }
]
const modal_slots: Record<string, string>[] = [
  { name: 'default', desc: '内容区' },
  { name: 'title', desc: '自定义标题(覆盖 title)' },
  { name: 'footer', desc: '自定义底部(覆盖默认按钮)' }
]
const modal_events: Record<string, string>[] = [
  { name: 'update:modelValue', desc: '显示状态变化(配合 v-model)', param: '(value: Boolean)' },
  { name: 'confirm', desc: '确认按钮点击', param: '-' },
  { name: 'cancel', desc: '取消按钮点击', param: '-' },
  { name: 'close', desc: '关闭时触发', param: '-' }
]
</script>

<template>
  <section class="kp-section">
    <h2 class="kp-section__title">对话框 / MODAL</h2>

    <div class="kp-demo">
      <div>
        <span class="kp-label">基础</span>
        <div class="kp-row">
          <button class="kp-modal-trigger" @click="basic_visible = true">打开弹窗</button>
          <button class="kp-modal-trigger kp-modal-trigger--green" @click="confirm_visible = true">确认操作</button>
          <button class="kp-modal-trigger kp-modal-trigger--magenta" @click="custom_visible = true">自定义内容</button>
        </div>
      </div>

      <div>
        <span class="kp-label">回显</span>
        <p class="preview__echo">&gt; {{ result || '(尚无操作)' }}</p>
      </div>
    </div>

    <!-- 基础弹窗 -->
    <Modal v-model="basic_visible" title="系统通知" color="cyan">
      连接已建立,数据流稳定传输中。本弹窗支持点击遮罩关闭、ESC 关闭。
    </Modal>

    <!-- 确认操作 -->
    <Modal
      v-model="confirm_visible"
      title="确认执行"
      color="green"
      confirm_text="执行"
      cancel_text="放弃"
      @confirm="result = '已确认执行操作'; confirm_visible = false"
      @cancel="result = '已取消操作'"
    >
      即将断开当前神经链路,此操作不可撤销。是否继续?
    </Modal>

    <!-- 自定义内容 + 底部 -->
    <Modal v-model="custom_visible" :width="520" color="magenta" :show_cancel="false">
      <template #title>
        <span style="color: var(--neon-magenta)">⚠ 异常报告</span>
      </template>

      <div class="kp-modal-report">
        <p>> 时间戳:2026-08-04 23:47:12</p>
        <p>> 节点:NIGHT_CITY_07</p>
        <p>> 状态:<span class="kp-modal-report--warn">ICE 防御触发</span></p>
        <p>> 建议:立即切换备用通道</p>
      </div>

      <template #footer>
        <button class="kp-modal-trigger kp-modal-trigger--magenta" @click="custom_visible = false">已知晓</button>
      </template>
    </Modal>

    <CodeBlock :code="modal_code" />

    <div class="preview__api">
      <ApiTable title="Props" :columns="props_columns" :rows="modal_props" />
      <ApiTable title="Slots" :columns="slots_columns" :rows="modal_slots" />
      <ApiTable title="Events" :columns="events_columns" :rows="modal_events" />
    </div>
  </section>
</template>

<style scoped>
.kp-modal-trigger {
  padding: 8px 18px;
  border: 1px solid var(--neon-cyan);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--neon-cyan);
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all var(--transition-fast);
}
.kp-modal-trigger:hover { background: rgba(0, 240, 255, 0.12); box-shadow: 0 0 8px rgba(0, 240, 255, 0.4); }
.kp-modal-trigger--green { border-color: var(--neon-green); color: var(--neon-green); }
.kp-modal-trigger--green:hover { background: rgba(0, 255, 159, 0.12); box-shadow: 0 0 8px rgba(0, 255, 159, 0.4); }
.kp-modal-trigger--magenta { border-color: var(--neon-magenta); color: var(--neon-magenta); }
.kp-modal-trigger--magenta:hover { background: rgba(255, 46, 151, 0.12); box-shadow: 0 0 8px rgba(255, 46, 151, 0.4); }

.kp-modal-report {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.kp-modal-report--warn { color: var(--neon-red); text-shadow: 0 0 6px var(--neon-red); }

.preview__echo {
  font-size: 12px;
  color: var(--neon-green);
  letter-spacing: 1px;
}
</style>
