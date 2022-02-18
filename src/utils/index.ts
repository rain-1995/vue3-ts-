export default {
  // 数字格式
  formatCount(num:number) :number|string {
    return num < 10000
      ? num
      : num < 100000000
        ? `${(num / 10000).toFixed(0)}万`
        : `${(num / 100000000).toFixed(0)}亿`
  }
}
