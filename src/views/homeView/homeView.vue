<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
import { useRouter, type RouteLocationRaw } from 'vue-router';

const router = useRouter();
onBeforeMount(() => { })
onMounted(() => { })
function handleNav(target: string) {
  router.push('/' + target);

} 
</script>
<template>
  <div class="home-view">
    <div class="title">
      <!-- ECO-TRACK -->
      AAA
    </div>
    <div class="nav">
      <div class="btn" @click="handleNav('add')">add</div>
      <div class="btn" @click="handleNav('detail')">detail</div>
      <div class="btn" @click="handleNav('trend')">trend</div>
      <div class="btn" @click="handleNav('tagManage')">tagManage</div>
    </div>
  </div>

</template>
<style lang="less" scoped>
.home-view {
  padding: 30rem;
  min-height: 100vh;

  .title {
    .title()
  }

  .nav {
    display: flex;
    margin: 30rem 0 0 0;

    .btn {
      .btn();

      margin: 0 20rem 0 0;


      &:last-child {
        margin: 0 0 0 0;
      }
    }
  }
}
</style>
