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

<style lang="less" scoped>
.login-view {
  display: flex;
  padding: 40rem;
  height: 100vh;

  .type-select {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
    font-size: 100rem;

    & > *:not(:last-child) {
      margin: 0 0 40rem 0;
    }

    .btn {
      .btn();
      font-size: 100rem;
    }
  }
}
</style>
