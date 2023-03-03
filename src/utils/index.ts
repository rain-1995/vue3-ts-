export default {
  // 数字格式 num 数字 toFixed 保留几位小数
  formatCount(num:number, toFixed = 0) :number|string {
    return num < 10000
      ? num
      : num < 100000000
        ? `${(num / (10000)).toFixed(toFixed)}万`
        : `${(num / 100000000).toFixed(toFixed)}亿`
  }
}
