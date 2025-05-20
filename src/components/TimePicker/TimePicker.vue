<script setup lang="ts">
import { ref, reactive, toRefs, onBeforeMount, onMounted, useTemplateRef } from 'vue'
import ScrollList from './components/ScrollList.vue'
const { defaultValue } = defineProps<{ defaultValue?: string }>()
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
const emit = defineEmits(['handleConfirm', 'handleCancel'])

let defaultValueList = defaultValue?.split(':')

const hour = ref('00')
const minute = ref('00')
const second = ref('00')
if (defaultValueList) {
  hour.value = defaultValueList[0].padStart(2, '0')
  minute.value = defaultValueList[1].padStart(2, '0')
  second.value = defaultValueList[2].padStart(2, '0')
}
const time = defineModel('time', {
  type: Object as () => [string, string, string],
  default: ['00', '00', '00']
})
function handleTimeConfirm() {
  time.value = [hour.value, minute.value, second.value]
  emit('handleConfirm', time.value)
}
function handleSetTimeNow() {
  let now = new Date()
  hour.value = now.getHours().toString().padStart(2, '0')
  minute.value = now.getMinutes().toString().padStart(2, '0')
  second.value = now.getSeconds().toString().padStart(2, '0')
}
</script>
<template>
  <div class="time-picker">
    <div class="control-btn">
      <div class="btn-item">{{ hour }}:{{ minute }}:{{ second }}</div>
      <div class="btn-item" @click="emit('handleCancel')">cancel</div>
      <div class="btn-item" @click="handleTimeConfirm">confirm</div>
      <div class="btn-item" @click="handleSetTimeNow">now</div>
    </div>
    <div class="input-line">
      <ScrollList v-model="hour" :options="hourList" />时
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
  background-color: rgb(95, 95, 95);
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
  }
}
</style>
