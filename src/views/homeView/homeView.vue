<script setup lang="ts">
import { ref, reactive, onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
onBeforeMount(() => {})
onMounted(() => {})
function handleNav(target: string) {
  router.push('/' + target)
}
</script>
<template>
  <div class="home-view">
    <div class="title">TRACK</div>
    <div class="nav">
      <div class="btn" @click="handleNav('add')">add</div>
      <div class="btn" @click="handleNav('detail')">detail</div>
      <div class="btn" @click="handleNav('trend')">trend</div>
      <div class="btn" @click="handleNav('tagManage')">tagManage</div>
      <div class="btn" @click="handleNav('MyCalendar')">MyCalendar</div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.home-view {
  padding: 20px;
  .title {
    font-size: 30px;
    text-align: center;
    margin-bottom: 20px;
  }
  .nav {
    display: flex;
    justify-content: space-around;
    .btn {
      cursor: pointer;
      padding: 10px;
      border: 1px solid #fff;
      border-radius: 5px;
      transition: all 0.3s;
      &:hover {
        background-color: #fff;
        color: #000;
      }
    }
  }
}
</style>
