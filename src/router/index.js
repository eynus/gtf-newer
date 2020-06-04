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
            redirect: 'inspection/mathBasic',
            component: () => import('../views/dataManage/components/inspection/Inspection.vue'),
            meta: {
              title: '质检管理',
              id: 'page_5_4'
            },
            children: [
              {
                path: 'mathBasic',
                name: 'MathBasic',
                component: () => import('../views/dataManage/components/inspection/components/MathBasic.vue'),
                meta: {
                  title: '数学基础规范性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'propStruct',
                name: 'PropStruct',
                component: () => import('../views/dataManage/components/inspection/components/PropStruct.vue'),
                meta: {
                  title: '属性结构规范性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'valRange',
                name: 'ValRange',
                component: () => import('../views/dataManage/components/inspection/components/ValRange.vue'),
                meta: {
                  title: '值域规范性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'graphTopo',
                name: 'GraphTopo',
                component: () => import('../views/dataManage/components/inspection/components/GraphTopo.vue'),
                meta: {
                  title: '图形拓扑规范性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'graphAbove',
                name: 'GraphAbove',
                component: () => import('../views/dataManage/components/inspection/components/GraphAbove.vue'),
                meta: {
                  title: '图形上图规范性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'propIn',
                name: 'PropIn',
                component: () => import('../views/dataManage/components/inspection/components/PropIn.vue'),
                meta: {
                  title: '属内一致性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'grapgGenus',
                name: 'GrapgGenus',
                component: () => import('../views/dataManage/components/inspection/components/GrapgGenus.vue'),
                meta: {
                  title: '图属一致性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'graphCorr',
                name: 'GraphCorr',
                component: () => import('../views/dataManage/components/inspection/components/GraphCorr.vue'),
                meta: {
                  title: '图图关联一致性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'graphTopoConsis',
                name: 'GraphTopoConsis',
                component: () => import('../views/dataManage/components/inspection/components/GraphTopoConsis.vue'),
                meta: {
                  title: '图图拓扑一致性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'genusTableConsis',
                name: 'GenusTableConsis',
                component: () => import('../views/dataManage/components/inspection/components/GenusTableConsis.vue'),
                meta: {
                  title: '属表一致性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'tableOrienConsis',
                name: 'TableOrienConsis',
                component: () => import('../views/dataManage/components/inspection/components/TableOrienConsis.vue'),
                meta: {
                  title: '表内横向逻辑一致性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'tablePortConsis',
                name: 'TablePortConsis',
                component: () => import('../views/dataManage/components/inspection/components/TablePortConsis.vue'),
                meta: {
                  title: '表内纵向逻辑一致性',
                  id: 'page_5_4'
                }
              },
              {
                path: 'tableInterConsis',
                name: 'TableInterConsis',
                component: () => import('../views/dataManage/components/inspection/components/TableInterConsis.vue'),
                meta: {
                  title: '表间逻辑一致性',
                  id: 'page_5_4'
                }
              },
            ]
          },
        ]
      },
      {
        path: '/system',
        name: 'system',
        component: () => import('../views/systemManage'),
        meta: {
          title: '运维管理'
        },
        children: [
          {
            path: 'user',
            name: 'User',
            component: () => import('../views/systemManage/user/index.vue'),
            meta: {
              title: '用户管理',
              id: 'page_4_1'
            }
          },
          {
            path: 'role',
            name: 'Role',
            component: () => import('../views/systemManage/role/index.vue'),
            meta: {
              title: '角色管理',
              id: 'page_4_2'
            }
          },
          {
            path: 'log',
            name: 'Log',
            component: () => import('../views/systemManage/log/index.vue'),
            meta: {
              title: '日志管理',
              id: 'page_4_4'
            }
          },
          {
            path: 'database',
            name: 'Database',
            component: () => import('../views/systemManage/database/index.vue'),
            meta: {
              title: '数据备份',
              id: 'page_4_3'
            }
          },
          {
            path: 'monitor',
            name: 'Monitor',
            component: () => import('../views/systemManage/monitor/index.vue'),
            meta: {
              title: '系统监控',
              id: 'page_4_5'
            }
          },
        ]
      },
      {
        path: '/pic',
        // name: 'pic',
        component: () => import('../views/picVisualization'),
        meta: {
          title: '一张图',
          id: 'page_1_1'
        },
        children: [
          {
            path: '',
            name: 'pic',
            component: () => import('../views/picVisualization/components/firstview/index.vue'),
            meta: {
              title: '一张图首页',
              // id: 'page_1_1'
            }
          },
          {
            path: 'situation',
            name: 'situation',
            component: () => import('../views/picVisualization/components/situation/Situation.vue'),
            meta: {
              title: '现状一张图',
              id: 'page_1_1'
            }
          },
          {
            path: 'plan',
            name: 'plan',
            component: () => import('../views/picVisualization/components/plan/Plan.vue'),
            meta: {
              title: '规划一张图',
              id: 'page_1_2'
            }
          },
          {
            path: 'approve',

            component: () => import('../views/picVisualization/components/approve/Approve.vue'),
            meta: {
              title: '审批一张图',
              id: 'page_1_3'
            },
            children: []
          },
          {
            path: 'supervision',
            component: () => import('../views/picVisualization/components/supervision/Supervision.vue'),
            meta: {
              title: '监管一张图',
              id: 'page_1_4'
            },
            children: []
          },
          {
            path: 'warning',
            component: () => import('../views/picVisualization/components/warning/Warning.vue'),
            meta: {
              title: '预警一张图',
              id: 'page_1_4'
            },
            children: []
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
  // console.log(to.name, role, routes);

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
