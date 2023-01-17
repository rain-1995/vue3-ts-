import http from '@/utils/request'
export default {
  // 首页圆形图标列表
  homeIconList: () => http('get', '/homepage/dragon/ball'),
  // 首页轮播图
  swiperList: (data:object) => http('post', '/banner', data),
  // 首页数据
  pageData: (data?:object) => http('post', '/homepage/block/page', data),
  // 热门话题
  hotTopic: (data?:object) => http('post', '/hot/topic', data), // params:limit,offset
  // 搜索默认词
  searchDefault: () => http('get', '/search/default'),
  // 歌曲URL
  songUrl: (data:object) => http('get', '/song/url', data), // params:id
  // 歌词
  lyric: (data:object) => http('get', '/lyric', data), // params:id
  // 歌曲详情
  songDetail: (data:object) => http('get', '/song/detail', data), // params:ids
  // 歌单详情
  playlistDetail: (data:object) => http('post', '/playlist/detail', data), // params:id
  // 歌单歌曲
  playlistSongs: (data:object) => http('post', '/playlist/track/all', data), // params:id,limit,offset
  // 发送验证码
  sendCode: (data:object) => http('post', '/captcha/sent', data), // params:phone
  // 登录
  login: (data:object) => http('get', '/login/cellphone', data), // params:phone,captcha,password
  // 验证验证码
  verify: (data:object) => http('post', '/captcha/verify', data), // params:phone,captcha
  // 获取账号信息
  accountInfo: () => http('get', '/user/account'),
  // 检查登录状态
  loginStatus: () => http('get', '/login/status'),
  // 退出登录
  logout: () => http('get', '/logout'),

  /**
   * 二维码登录相关
   */
  // 获取二维码的key
  getQrKey: () => http('get', '/login/qr/key'),
  // 生成二维码
  createQrCode: (data:object) => http('get', '/login/qr/create', data),
  // 检测二维码状态，轮询此接口
  checkQrCodeStatus: (data:object) => http('get', '/login/qr/check', data, { resolve: true, message: false }),

  /**
   * 个人主页相关
   */

  // 我喜欢的音乐列表
  likeList: (data:object) => http('get', '/likelist', data),
  // 获取用户信息 , 歌单，收藏，mv, dj 数量
  userSubInfo: (data:object) => http('get', '/user/subcount', data),
  // 获取用户歌单
  userPlayList: (data:object) => http('get', '/user/playlist', data),
  // 用户详情
  userDetail: (data:object) => http('get', '/user/detail', data),

  // 动态
  dynamic: (data:object) => http('get', '/event', data)
}
