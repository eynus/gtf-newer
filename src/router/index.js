import Vue from 'vue'
import VueRouter from 'vue-router'
import { getToken } from '@/utils/auth'
// import { removeToken } from '@/utils/auth'
import Main from '@/components/Main.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '登录',
      auth: false
    },
    component: () => import('@/views/login')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/guide'),
    meta: {
      title: '引导页'
    }
  },
  {
    path: '/',
    redirect: '/home',
    component: Main,
    children: [
      {
        path: '/data',
        name: 'data',
        component: () => import('../views/dataManage'),
        meta: {
          title: '数据管理'
        },
        children: [
          {
            path: 'overview',
            name: 'Overview',
            component: () => import('../views/dataManage/components/overview/Overview.vue'),
            meta: {
              title: '数据总览',
              id: 'page_5_1'
            }
          },
          {
            path: 'query',
            name: 'Query',
            component: () => import('../views/dataManage/components/query/Query.vue'),
            meta: {
              title: '查询浏览',
              id: 'page_5_2'
            }
          },
          {
            path: 'service',

            component: () => import('../views/dataManage/components/service/Service.vue'),
            meta: {
              title: '服务管理',
              id: 'page_5_3'
            },
            children: [
              {
                path: '',
                name: 'Service',
                component: () => import('../views/dataManage/components/service/components/ServiceManage.vue'),
                meta: {
                  title: '服务管理首页',
                  id: 'page_5_3'
                }
              },
              {
                path: 'register',
                name: 'Register',
                component: () => import('../views/dataManage/components/service/components/ServiceRegister.vue'),
                meta: {
                  title: '服务注册',
                  id: 'page_5_3'
                }
              }
            ]
          },
          {
            path: 'inspection',
            // name: 'inspection',
            component: () => import('../views/dataManage/components/inspection/Inspection.vue'),
            meta: {
              title: '质检管理',
              id: 'page_5_4'
            },
            children:[
              {
                path: '',
                name: 'MathBasic',
                component: () => import('../views/dataManage/components/inspection/components/MathBasic.vue'),
                meta: {
                  title: '数学基础规范性',
                  id: 'page_5_4'
                }
              }
            ]
          },
        ]
      }
    ]
  },

  {
    path: '*',
    name: 'error_401',
    component: () => import('../views/error'),
    meta: {
      title: '404'
    }
  }
]

const router = new VueRouter({
  routes
})
const LOGIN_PAGE_NAME = 'login';

/**
 * 权鉴
 * @param {*} name 即将跳转的路由
 * @param {*} roles 用户权限 1,2,3
 * @param {*} routes 路由列表 this.$router [{name:'xx',children:[{..}]},{name:'xx'},children:[{...}]]
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, roles, routes) => {//roles:localStorage存的role
  // console.log('name:', name, 'roles:', roles, 'routes:', routes)
  const routePermissionJudge = list => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {

        return hasAccess(roles, item)
      }
    })
  }
  return routePermissionJudge(routes)
}
// 设置路由权限
const turnTo = (to, role, next) => {
  if (canTurnTo(to.name, role, routes)) next();// 有权限，可访问
  else next({ replace: true, name: 'error_401' });// 无权限，重定向到401页面
};
/**
 * @param {*} roles 用户权限 1,2,3
 * @param {*} route 路由列表
 */
const hasAccess = (roles, route) => {
  //有id代表是二级菜单
  if (route.meta && route.meta.id) {
    //判断route.meta.id在不在roles里面
    let result = roles.some((item) => {
      return item.childs.indexOf(route.meta.id) > -1//item.childs里面包含id
    })
    return true

  } else return true
}

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
    if (localStorage.getItem('role')) {
      turnTo(to, JSON.parse(localStorage.getItem('role')), next);
    } else {
      // removeToken()
      alert('你没有权限')
      // next({
      //   name: LOGIN_PAGE_NAME // 跳转到登录页
      // });
    }
  }
});


export default router
