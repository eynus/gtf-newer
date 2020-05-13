import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Main from '@/components/Main.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录'
    },
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'guide',
    component: () => import('../views/Guide.vue'),
    meta: {
      title: '引导页'
    }
  },
  {
    path: '/',
    name: 'Home',
    component: Main,
    children: [
      {
        path: 'overview',
        name: 'Overview',
        component: () => import('../views/Overview.vue'),
        meta: {
          title: '数据总览'
        }
      },
      {
        path: 'query',
        name: 'Query',
        component: () => import('../views/Query.vue'),
        meta: {
          title: '查询浏览'
        }
      },
      {
        path: 'service',
        name: 'Service',
        component: () => import('../views/Service.vue'),
        meta: {
          title: '服务管理'
        }
      },
      {
        path: 'inspection',
        name: 'inspection',
        component: () => import('../views/Inspection.vue'),
        meta: {
          title: '质检管理'
        }
      },
    ]
  },

  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
