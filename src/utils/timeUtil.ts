export default {
  // 分秒转毫秒
  timeToSec: (time:string):number => {
    const timeArr = time.split(':')
    const s = Number(timeArr[0]) * 60 + Number(timeArr[1])
    return parseFloat(s.toFixed(3))
  },
  // 秒转分：秒
  secToTime: (time:number) => {
    time = Math.floor(time)
    const m = Math.floor(time / 60)
    const s = time % 60
    return `${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}`
  }
}
