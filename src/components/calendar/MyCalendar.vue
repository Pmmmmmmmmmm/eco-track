<template>
  <div class="calendar">
    <CalendarBody />
    <CalendarHeader />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import CalendarBody from './components/calendar-body.vue'
import CalendarHeader from './components/calendar-header.vue'
</script>

<style scoped lang="less">
.calendar {
  color: #000;
  display: flex;
  flex-direction: column;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #dbd5ae;
}
</style>
