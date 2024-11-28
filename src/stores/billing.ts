import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBillingStore = defineStore('billing', () => {
  const billingData = ref([])

  function getBillingData() {}

  return {}
})
