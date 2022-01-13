interface routeModel {
  path:string,
  name:string,
  component:Function,
  meta?:object,
  redirect?:string,
  children?:routeModel[]
}
export default routeModel
