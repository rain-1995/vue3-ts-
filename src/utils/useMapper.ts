import { computed } from 'vue'
import { useStore } from 'vuex'
import { keysObject } from './types'
export function useMapper(mapper:object, mapFn:(arg:object)=>object) {
  // 拿到store独享
  const store = useStore()

  // 获取到对应的对象的functions: {name: function, age: function}
  const storeStateFns:keysObject = mapFn(mapper)

  // 对数据进行转换
  const storeState:keysObject = {}
  Object.keys(storeStateFns).forEach((fnKey) => {
    const fn = storeStateFns[fnKey].bind({ $store: store })
    // console.log('fn', fn);
    storeState[fnKey] = computed(fn)
  })
// console.log('storeState', storeState);
  return storeState
}
