/* eslint no-undef: "off" */
/*global response*/
/** 接口数据返回类型*/
declare interface response {
  code?: number
  data?: any
  [key?: string]: any

}

/** 一个包含任意属性对象类型 */
declare type anyObject = {
  [key: string]: any
}

// declare global {
//   /** 一个包含任意属性对象类型 */
//   interface anyObject {
//     [key: string]: any
//   }
// }

// export {}

// declare module 'vue' {
//   interface anyObject {
//     [key: string]: any
//   }
// }
