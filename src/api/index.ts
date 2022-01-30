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
  // 歌曲URL
  songUrl: (data:object) => http('get', '/song/url', data), // params:id
  // 歌词
  lyric: (data:object) => http('get', '/lyric', data), // params:id
  // 歌曲详情
  songDetail: (data:object) => http('get', '/song/detail', data) // params:ids

}
