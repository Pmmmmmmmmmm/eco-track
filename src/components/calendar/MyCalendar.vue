<script setup lang="ts">
import { ref, computed } from 'vue'
import DaysView from './components/DaysView.vue'
import YearAndMonth from './components/YearAndMonth.vue'
const year = ref()
const month = ref()
const day = ref()
function setDefaultDate(defaultDate: Date = new Date()) {
  year.value = defaultDate.getFullYear()
  month.value = defaultDate.getMonth() + 1
  day.value = defaultDate.getDate()
}
setDefaultDate()
let currentView = ref<'calendar' | 'year&month'>('calendar')
function handleViewChange() {
  if (currentView.value === 'calendar') {
    currentView.value = 'year&month'
  } else {
    currentView.value = 'calendar'
  }
}
const getTipText = computed(() => {
  let now = new Date()
  let selectedDate = new Date(year.value, month.value - 1, day.value)
  let diff = selectedDate.getTime() - now.getTime()
  let daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return daysDiff == 0
    ? '今天'
    : daysDiff == -1
      ? `昨天`
      : daysDiff == -2
        ? '前天'
        : `${Math.abs(daysDiff)}天前`
})
const emit = defineEmits(['handleConfirm', 'handleCancel'])
</script>
<template>
  <div class="calendar">
    <div class="calendar-value">
      {{ year }}年 {{ month }}月 {{ day }}日
      <div class="value-tip">{{ getTipText }}</div>
    </div>
    <div class="calendar-header">
      <div class="ctrl-btn" @click="emit('handleCancel')">cancel</div>
      <div class="ctrl-btn" @click="emit('handleConfirm', [year, month, day])">confirm</div>
      <div class="ctrl-btn" @click="handleViewChange">切换视图</div>
      <div class="ctrl-btn" @click="() => setDefaultDate()">今</div>
    </div>
    <div class="calendar-body">
      <YearAndMonth
        :currentView="currentView"
        v-show="currentView === 'year&month'"
        v-model:year="year"
        v-model:month="month"
      />
      <DaysView
        v-show="currentView === 'calendar'"
        v-model:year="year"
        v-model:month="month"
        v-model:day="day"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.calendar {
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-color: #dbd5ae;

  .calendar-value {
    padding: 10px;
    font-size: 24px;
    display: flex;
    align-items: center;
    .value-tip {
      font-size: 16px;
      color: #666;
      margin-left: 10px;
      border: 1px solid #000000;
      padding: 4px;
      width: fit-content;
      border-radius: 4px;
    }
  }
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

  .calendar-body {
    width: 100vw;
    height: 80vw;
  }
}
</style>
