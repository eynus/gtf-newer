import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/auth'
// import {  removeToken,canTurnTo } from '@/utils/auth'
import Data from '@/views/Data.vue'
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
    name: 'home',
    component: () => import('../views/Guide.vue'),
    meta: {
      title: '引导页'
    }
  },
  {
    path: '/',
    component: Main,
    children: [
      {
        path: '/data',
        name: 'data',
        component: Data,
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
      }
    ]
  },

  {
    path: '*',
    name: '404',
    component: () => import('../views/Error.vue'),
    meta: {
      title: '404'
    }
  }
]

const router = new VueRouter({
  routes
})
const LOGIN_PAGE_NAME = 'login';
// 设置路由权限
// const turnTo = (to, role, next) => {
//   if (canTurnTo(to.name, role, routes)) next();// 有权限，可访问
//   else next({ replace: true, name: 'error_401' });// 无权限，重定向到401页面
// };

router.beforeEach((to, from, next) => {
  const token = getToken();
  //没有token且要访问非登录页面
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    });
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页则直接跳转
    next();
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next();
  } else {
    next()
    // if (localStorage.getItem('role')) {
    //   turnTo(to, JSON.parse(localStorage.getItem('role')), next);
    // } else {
    //   removeToken()
    //   next({
    //     name: LOGIN_PAGE_NAME // 跳转到登录页
    //   });
    // }
  }
});


export default router
