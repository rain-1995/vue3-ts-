/**
 * 云音乐nodejs 接口api文档 https://binaryify.github.io/NeteaseCloudMusicApi/#/
 */
import http from '@/utils/request'
export default {
  // 首页圆形图标列表
  homeIconList: () => http('get', '/homepage/dragon/ball'),
  // 首页轮播图
  swiperList: (data:object) => http('post', '/banner', data),
  // 首页数据
  pageData: (data?:object) => http('post', '/homepage/block/page', data),
  // 热门话题
  hotTopic: (data?:object) => http('post', '/hot/topic', data, { resolve: true, message: false }), // params:limit,offset
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
  // 歌单评论
  playlistComments: (data:object) => http('post', '/comment/playlist', data), // params:id,limit,offset
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
  dynamic: (data:object) => http('get', '/event', data),

  // 榜单
  topList: () => http('get', '/toplist'),
  // 所有榜单内容摘要
  topListDetail: () => http('get', '/toplist/detail'),
  // 热搜
  hotSearchList: () => http('get', '/search/hot'),
  // 热搜详细
  hotSearchListDetail: () => http('get', '/search/hot/detail'),
  // 搜索建议
  suggest: (data:object) => http('get', '/search/suggest', data),
  multimatch: (data:object) => http('get', '/search/multimatch', data),
  cloudsearch: (data:object) => http('get', '/cloudsearch', data),
  // 关注取消关注用户
  follow: (data:object) => http('post', '/follow', data, { message: false }),

  // 视频相关
  videoDetail: (data:object) => http('post', '/video/detail', data),
  videoUrl: (data:object) => http('post', '/video/url', data),
  videoInfo: (data:object) => http('post', '/video/detail/info', data),

  // mv相关
  mvDetail: (data:object) => http('post', '/mv/detail', data),
  mvUrl: (data:object) => http('post', '/mv/url', data),
  mvInfo: (data:object) => http('post', '/mv/detail/info', data),

  // 资源点赞
  handleLike: (data:object) => http('post', '/resource/like', data),
  // 收藏取消收藏视频
  videoCollect: (data:object) => http('post', '/video/sub', data),
  // 收藏取消收藏mv
  mvCollect: (data:object) => http('post', '/mv/sub', data),
  // 评论集合接口
  videoComment: (data:object) => http('post', '/comment/new', data),
  // 回复
  reply: (data:object) => http('post', '/comment/floor', data),
  // mv评论
  // mvComment: (data:object) => http('post', '/comment/mv', data),
  // 评论点赞
  commentLike: (data:object) => http('post', '/comment/like', data),
  // 歌单分类
  sheetCateList: () => http('post', '/playlist/catlist'),
  // 精品歌单标签
  highQualitySheetCateList: (data:object) => http('post', '/playlist/highquality/tags', data),
  // 热门歌单分类
  hotSheetCateList: () => http('post', '/playlist/hot'),
  // 分类下的歌单
  categorySheetDetail: (data: object) => http('post', '/top/playlist', data),

  /**
   * 通知私信相关
   */
  // 私信
  privateMessage: (data?: object) => http('post', '/msg/private', data),
  // 私信内容
  privateHistory: (data?: object) => http('post', '/msg/private/history', data)
}
