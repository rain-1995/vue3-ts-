import { createRouter, createWebHistory } from 'vue-router'
const routes:[] = []
const files = require.context('./modules/', false, /.ts$/)
files.keys().forEach(file => {
  const fileName = (<Function>file.match)(/(?<=\.\/).+(?=.ts)/)[0]
  let route:object = files(file).default || files(file)[fileName]
  route = Array.isArray(route) ? [...route] : [route]
  routes.push(...route as [])
})
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

