<template>
  <div class="calendar">
    <div class="year-month">
      <div class="year">{{ year }}</div>
      <div class="month">{{ month }}</div>
    </div>
    <div class="calendar-header">
      <div class="ctrl-btn">cancel</div>
      <div class="ctrl-btn">confirm</div>
      <div class="ctrl-btn">change</div>
    </div>
    <YearAndMonth v-model:year="year" v-model:month="month" />
    <!-- <CalendarBody :model-value="props.modelValue" @update:model-value="updateModelValue" /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CalendarBody from './components/CalendarBody.vue'
import YearAndMonth from './components/YearAndMonth.vue'
const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)

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
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #dbd5ae;
  .calendar-header {
    display: flex;
    align-items: center;
    .ctrl-btn {
      height: 30px;
      padding: 0 10px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f0f0f0;
      border-radius: 5px;
      margin: 10px;
      cursor: pointer;
    }
  }
}
</style>
