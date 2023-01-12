export interface paramsModel{
  (method:string, url:string, data?:object, options?:object):object
}
export interface keysObject{
  [key:string]:any
}
export interface userDetailType{ // 用户详情
  profile?: object,
  profileVillageInfo?:object,
  userPoint?:object,
  level?: number | string
}
