import http from '@/utils/request'
export default {
  // 首页圆形图标列表
  homeIconList: () => http('get', '/homepage/dragon/ball'),
  // 首页轮播图
  swiperList: (data:object) => http('post', '/banner', data),
  // 首页数据
  pageData: (data?:object) => http('post', '/homepage/block/page', data),
  // 搜索默认词
  searchDefault: () => http('get', '/search/default'),
}
