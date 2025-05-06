/**
 * 函数节流
 * @param fn 节流方法
 * @param time 间隔时间
 * @param config 配置 {first：首次点击是否执行 end：时间结束后是否执行}
 * @returns
 */
export function throttle<T>(
  fn: T,
  time = 500,
  config: { first?: boolean; end?: boolean } = { first: true, end: false }
): T {
  let canRun: boolean = true
  if (typeof fn !== 'function') {
    throw new TypeError('类型错误，传入函数不是一个方法')
  }
  return function (this: unknown, ...args: any[]) {
    if (config.first && canRun) fn.apply(this, args)
    if (!canRun) return
    canRun = false
    setTimeout(() => {
      config.end && fn.apply(this, args)
      canRun = true
    }, time)
  } as any
}

/**
 * 函数防抖
 * @param fn 防抖方法
 * @param time 间隔时间
 * @param config 配置 {first：首次点击是否执行 end：时间结束后是否执行}
 * @returns
 */
export function debounce<T>(
  fn: T,
  time = 500,
  config: { first?: boolean; end?: boolean } = { first: true, end: false }
): T {
  let timeout: number | null = null
  if (typeof fn !== 'function') {
    throw new TypeError('类型错误，传入函数不是一个方法')
  }
  return function (this: unknown, ...args: any[]) {
    if (config.first && !timeout) fn.apply(this, args)
    timeout && clearTimeout(timeout)
    timeout = setTimeout(() => {
      config.end && fn.apply(this, args)
      timeout = null
    }, time)
  } as any
}
// 格式化日期函数
export function formatDate(dateString: string): string {
  // 创建 Date 对象
  const date = new Date(dateString)

  // 获取年、月、日、时、分、秒
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从0开始，所以加1
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // 返回格式化的日期字符串
  return `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`
}
