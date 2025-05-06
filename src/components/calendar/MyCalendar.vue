<template>
  <Teleport to="body">
    <div class="calendar">
      <CalendarBody :model-value="props.modelValue" @update:model-value="updateModelValue" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CalendarBody from './components/calendar-body.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['update:modelValue'])

function updateModelValue(value: string) {
  emit('update:modelValue', value)
}
</script>

<style scoped lang="less">
.calendar {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  color: #000;
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #dbd5ae;
}
</style>
