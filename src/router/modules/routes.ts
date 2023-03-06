import routeModel from '../routeModel'
export const routes : routeModel[] = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout/layout.vue'),
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home.vue'),
    meta: {
      title: '首页'
    }
  },
  {
    path: '/podcast',
    name: 'podcast',
    component: () => import('@/views/podcast.vue'),
    meta: {
      title: '播客'
    }
  },
  {
    path: '/follow',
    name: 'follow',
    component: () => import('@/views/follow.vue'),
    meta: {
      title: '关注'
    }
  },
  {
    path: '/my',
    name: 'my',
    component: () => import('@/views/my/index.vue'),
    meta: {
      title: '我的'
    }
  },
  {
    path: '/cloud',
    name: 'cloud',
    component: () => import('@/views/cloud.vue'),
    meta: {
      title: '云村'
    }
  },
  {
    path: '/songPlay/:id',
    name: 'songPlay',
    component: () => import('@/views/songPlay.vue'),
    meta: {
      title: '播放',
      fullScreen: true
    }
  },
  {
    path: '/songSheet/:id',
    name: 'songSheet',
    component: () => import('@/views/songSheet.vue'),
    meta: {
      title: '歌单',
      fullScreen: true
    }
  },
  {
    path: '/sheetSquare',
    name: 'sheetSquare',
    component: () => import('@/views/sheetSquare/index.vue'),
    meta: {
      title: '歌单广场',
      fullScreen: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
      fullScreen: true
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/index.vue'),
    meta: {
      title: '歌曲搜索',
      fullScreen: true
    }
  },
  {
    path: '/searchResult',
    name: 'searchResult',
    component: () => import('@/views/search/index.vue'),
    meta: {
      title: '搜索结果',
      fullScreen: true
    }
  },
  {
    path: '/playVideo/:id',
    name: 'playVideo',
    component: () => import('@/views/video-detail/index.vue'),
    meta: {
      title: '视频详情',
      fullScreen: true
    }
  }
]
