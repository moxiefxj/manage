import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index.vue'),
    children:[{
      path: 'classfiy',
      meta: {
        publicPage: false,
      },
      component: () => import('../views/classfiy.vue'),
    },{
      path: 'second',
      meta: {
        publicPage: false,
      },
      component: () => import('../views/second.vue'),
    },{
      path: 'third',
      meta: {
        publicPage: false,
      },
      component: () => import('../views/third.vue'),
    },{
      path: 'course',
      meta: {
        publicPage: false,
      },
      component: () => import('../views/course.vue'),
    },{
      path: 'number',
      meta: {
        publicPage: false,
      },
      component: () => import('../views/number.vue'),
    },{
      path: 'menu',
      meta: {
        publicPage: false,
      },
      component: () => import('../views/menu.vue'),
    },{
      path: 'evaluation',
      meta: {
        publicPage: false,
      },
      component: () => import('../views/evaluation.vue'),
    }]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
