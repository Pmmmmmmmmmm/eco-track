import axiosInstance from '../index'
import type { PageOrderDto, OrderListDto, addOrderDto } from '@/types/order'
import type { AxiosResponse } from 'axios'
export const getOrderList = async (params: PageOrderDto): Promise<AxiosResponse<OrderListDto>> => {
  return await axiosInstance.get('/orders/getOrderPage', { params })
}
export const addOrder = async (data: addOrderDto): Promise<AxiosResponse> => {
  return await axiosInstance.post('/orders/addOrders', data)
}
