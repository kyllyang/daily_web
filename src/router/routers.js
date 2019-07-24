import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/my-work',
    name: 'my_work',
    meta: {
      icon: 'md-menu',
      title: '我的工作'
    },
    component: Main,
    children: [
      {
        path: 'edit_worklog',
        name: 'edit_worklog',
        meta: {
          icon: 'md-funnel',
          title: '日报填写'
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'my_process',
        name: 'my_process',
        meta: {
          icon: 'md-funnel',
          title: '我的申请'
        },
        component: () => import('@/view/excel/export-excel.vue')
      },
      {
        path: 'my_task',
        name: 'my_task',
        meta: {
          icon: 'md-funnel',
          title: '我的任务'
        },
        component: () => import('@/view/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/organization',
    name: 'organization',
    meta: {
      icon: 'md-menu',
      title: '组织机构管理'
    },
    component: Main,
    children: [
      {
        path: 'org_employee',
        name: 'org_employee',
        meta: {
          icon: 'md-funnel',
          title: '员工管理'
        },
        component: () => import('@/view/daily/org-employee-table.vue')
      },
      {
        path: 'org_team',
        name: 'org_team',
        meta: {
          icon: 'md-funnel',
          title: '团队管理'
        },
        component: () => import('@/view/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/customer',
    name: 'customer',
    meta: {
      icon: 'md-menu',
      title: '客户管理'
    },
    component: Main,
    children: [
      {
        path: 'customer_company',
        name: 'customer_company',
        meta: {
          icon: 'md-funnel',
          title: '客户公司管理'
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'customer_employee',
        name: 'customer_employee',
        meta: {
          icon: 'md-funnel',
          title: '客户员工管理'
        },
        component: () => import('@/view/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/project',
    name: 'project',
    meta: {
      icon: 'md-menu',
      title: '项目管理'
    },
    component: Main,
    children: [
      {
        path: 'project_page',
        name: 'project_page',
        meta: {
          icon: 'md-funnel',
          title: '项目管理'
        },
        component: () => import('@/view/directive/directive.vue')
      }
    ]
  },
  {
    path: '/statistics',
    name: 'statistics',
    meta: {
      icon: 'md-menu',
      title: '统计分析'
    },
    component: Main,
    children: [
      {
        path: 'worklog_summary',
        name: 'worklog_summary',
        meta: {
          icon: 'md-funnel',
          title: '日报汇总'
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'worklog_finished',
        name: 'worklog_finished',
        meta: {
          icon: 'md-funnel',
          title: '已填写日报'
        },
        component: () => import('@/view/excel/export-excel.vue')
      },
      {
        path: 'worklog_missing',
        name: 'worklog_missing',
        meta: {
          icon: 'md-funnel',
          title: '未填写日报'
        },
        component: () => import('@/view/excel/export-excel.vue')
      },
      {
        path: 'worklog_approved',
        name: 'worklog_approved',
        meta: {
          icon: 'md-funnel',
          title: '已审批日报'
        },
        component: () => import('@/view/excel/export-excel.vue')
      },
      {
        path: 'worklog_noapproved',
        name: 'worklog_noapproved',
        meta: {
          icon: 'md-funnel',
          title: '未审批日报'
        },
        component: () => import('@/view/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/workload',
    name: 'workload',
    meta: {
      icon: 'md-menu',
      title: '工作量整理'
    },
    component: Main,
    children: [
      {
        path: 'workload_page',
        name: 'workload_page',
        meta: {
          icon: 'md-funnel',
          title: '工作量整理'
        },
        component: () => import('@/view/directive/directive.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-menu',
      title: '系统管理',
      access: ['super_admin']
    },
    component: Main,
    children: [
      {
        path: 'permission',
        name: 'permission',
        meta: {
          icon: 'md-funnel',
          title: '权限管理'
        },
        component: () => import('@/view/excel/upload-excel.vue')
      },
      {
        path: 'holidays',
        name: 'holidays',
        meta: {
          icon: 'md-funnel',
          title: '假日管理'
        },
        component: () => import('@/view/excel/export-excel.vue')
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        component: () => import('@/view/argu-page/params.vue')
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        component: () => import('@/view/argu-page/query.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
