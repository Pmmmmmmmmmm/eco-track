<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, h, compile } from 'vue'

onBeforeMount(() => {})
let refEl = ref(null)
onMounted(() => {})

let loginType = ''
</script>
<template>
  <childComponents ref="refEl" />
  <div class="login-view">
    <!-- <div class="type-select">
      <div class="btn" @click="loginType = 'online'">online</div>
      <span>/</span>
      <div class="btn" @click="loginType = 'local'">local</div>
    </div> -->
  </div>
</template>

<style lang="less" scoped></style>
