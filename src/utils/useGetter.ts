import { mapGetters, createNamespacedHelpers } from 'vuex'
import { useMapper } from './useMapper'

const useGetters = (moduleName:string, mapper:object) => {
  let mapperFn = mapGetters
  if (typeof moduleName === 'string' && moduleName.length > 0) {
    mapperFn = createNamespacedHelpers(moduleName).mapGetters
  }

  return useMapper(mapper, mapperFn)
}
export default useGetters
