<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, defineProps } from 'vue'
let props = defineProps(['pageSize'])
onBeforeMount(() => {})
onMounted(() => {})
let pageMap = new Map()
let dataCache = []
let pageSize = props.pageSize
</script>
<template>
  <div class="virtualScroll"></div>
</template>
<style lang="less" scoped>
.virtualScroll {
}
</style>
