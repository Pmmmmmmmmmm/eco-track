<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, useTemplateRef } from 'vue'
import ScrollList from './components/ScrollList.vue'
const hourList = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23'
]
const minuteList = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '50',
  '51',
  '52',
  '53',
  '54',
  '55',
  '56',
  '57',
  '58',
  '59'
]

const secondList = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '50',
  '51',
  '52',
  '53',
  '54',
  '55',
  '56',
  '57',
  '58',
  '59'
]

const hour = ref('00')
const minute = ref('00')
const second = ref('00')
const time = defineModel('time', {
  type: Object as () => [number, number, number],
  default: [0, 0, 0]
})

onMounted(() => {})
</script>
<template>
  <div class="time-picker">
    {{ hour }} : {{ minute }} : {{ second }}
    <div class="control-btn">
      <div class="btn-item">cancel</div>
      <div class="btn-item">confirm</div>
      <div class="btn-item">now</div>
    </div>
    <div class="input-line">
      <div class="line"></div>
      <ScrollList :options="hourList" v-model="hour" />时
      <ScrollList v-model="minute" :options="minuteList" />分
      <ScrollList v-model="second" :options="secondList" />秒
    </div>
  </div>
</template>
<style lang="less" scoped>
.time-picker {
  display: flex;
  flex-direction: column;
  width: 100vw;
  background-color: antiquewhite;
  .control-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .btn-item {
      padding: 10px;
      font-size: 18px;
      border-radius: 6px;
      background-color: rgb(0, 72, 48);
      color: bisque;
    }
  }
  .input-line {
    height: 60vw;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 30px;
    position: relative;
    .line {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 100%;
      height: 1px;
      background-color: rgb(0, 72, 48);
    }
  }
}
</style>
