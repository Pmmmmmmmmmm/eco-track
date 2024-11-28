<script setup lang="ts">
import { log } from 'console'
import { ref, reactive, toRefs, onBeforeMount, onMounted } from 'vue'
onBeforeMount(() => {})
onMounted(() => {})
type Tag = {
  name: string
  color: string
}
let tagList = ref<Tag[]>([])

let handleTagDel = (index: number) => {
  console.log(index)
}
let handleTagChange = (index: number) => {
  console.log(index)
}
let handleAddClick = () => {
  tagList.value.push({
    name: 'a',
    color: ''
  })
}
</script>
<template>
  <div class="tag">
    <div class="tag-table">
      <div class="table-head">
        <div class="name">type</div>
        <div class="color">color</div>
        <div class="options">options</div>
      </div>
      <div class="table-body">
        <div class="tag-item" v-for="(item, index) in tagList" :key="item.name">
          <div class="name">{{ item.name }}</div>
          <div class="color">{{ item.color || '-' }}</div>
          <div class="options">
            <div class="btn" @click="handleTagChange(index)">改</div>
            /
            <div class="btn" @click="handleTagDel(index)">删</div>
          </div>
        </div>
      </div>
      <div class="empty-tip" v-if="tagList.length == 0">---Empty---</div>
    </div>
    <div class="tag-add" @click="handleAddClick">ADD</div>
  </div>
</template>
<style lang="less" scoped>
.tag-table {
  height: calc(100vh - 100rem);
  margin: 20rem;
  padding: 20rem;
  font-size: 50rem;
  display: flex;
  flex-direction: column;

  .table-head {
    flex-shrink: 0;
    display: flex;
    border-bottom: 6rem dotted #000000;

    & > div {
      line-height: 100rem;
      width: 33.3%;
      text-align: center;
    }
  }

  .table-body {
    flex-grow: 1;
    flex-shrink: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;

    .tag-item {
      border-bottom: 6rem dotted #000000;
      display: flex;

      & > div {
        height: 100rem;
        line-height: 100rem;
        width: 33.3%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .empty-tip {
    flex: 1;
    width: 100%;
    text-align: center;
    margin: 30rem 0;
    color: #b0b0b0;
  }
}

.tag-add {
  height: 100rem;
  font-size: 70rem;
  line-height: 100rem;
  width: fit-content;
  margin: 0 auto;
  user-select: none;
}
</style>
