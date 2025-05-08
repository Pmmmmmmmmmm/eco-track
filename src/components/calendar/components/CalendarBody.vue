<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, watch, watchEffect } from 'vue'

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
</script>
<template>
  <div>
    <div class="header">
      <div class="daysOfWeek-item" v-for="(item, index) in daysOfWeek" :key="index">{{ item }}</div>
    </div>
    <div class="body">
      <div>
        {{ 123 }}
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped></style>
