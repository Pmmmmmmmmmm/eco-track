<script setup lang="ts">
import MyCalendar from '@/components/calendar/MyCalendar.vue'
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
onBeforeMount(() => {})
onMounted(() => {})
</script>
<template>
  <div class="myCalendarView">
    <MyCalendar />
  </div>
</template>
<style lang="less" scoped></style>
