import { mapState, createNamespacedHelpers } from 'vuex'
import { useMapper } from './useMapper'

const useState = (moduleName:string, mapper:object) => {
  let mapperFn = mapState
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapState
  }
  // console.log('mapperFn', mapperFn);
  return useMapper(mapper, mapperFn)
}
export default useState
