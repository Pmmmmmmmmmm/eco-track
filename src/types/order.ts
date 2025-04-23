export interface PageOrderDto {
  page: number // 当前页码
  pageSize: number // 每页条数
}

export interface OrderDto {
  id: number // 订单ID
  transactionTime: string // 交易时间
  amount: number // 金额(元)
  createdAt: string // 创建时间
  updatedAt: string // 更新时间
  commodity: string // 商品名称
}

export interface OrderListDto {
  count: number // 总条数
  list: OrderDto[] // 订单列表
  currentPage: number // 当前页码
  totalPage: number // 总页码
}
export interface addOrderDto {
  commodity: string // 商品名称
  amount: number // 金额(元)
  transactionTime: string // 交易时间
}
