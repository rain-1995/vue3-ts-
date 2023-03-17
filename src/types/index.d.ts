/** 接口数据返回类型*/
/*global response*/
/* eslint no-undef: "off" */
declare interface response {
  code?: number
  data?: any

}

/** 一个包含任意属性对象类型 */
declare type anyObject = {
  [key: string]: any
}
