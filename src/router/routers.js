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
        component: () => import('@/view/daily/mine/worklog-daily-record-form.vue')
      },
      {
        path: 'audit_worklog',
        name: 'audit_worklog',
        meta: {
          icon: 'md-funnel',
          title: '日报审核',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/mine/worklog-daily-record-audit-table.vue')
      },
      {
        path: 'my_process',
        name: 'my_process',
        meta: {
          icon: 'md-funnel',
          title: '我的申请'
        },
        component: () => import('@/view/daily/blank.vue')
      },
      {
        path: 'my_task',
        name: 'my_task',
        meta: {
          icon: 'md-funnel',
          title: '我的任务'
        },
        component: () => import('@/view/daily/blank.vue')
      },
      {
        path: 'my_team',
        name: 'my_team',
        meta: {
          icon: 'md-funnel',
          title: '我的团队',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/organization/my-org-employee-table.vue')
      }
    ]
  },
  {
    path: '/worklog',
    name: 'worklog',
    meta: {
      icon: 'md-menu',
      title: '工作记录'
    },
    component: Main,
    children: [
      {
        path: 'worklog_daily_record',
        name: 'worklog_daily_record',
        meta: {
          icon: 'md-funnel',
          title: '日报管理'
        },
        component: () => import('@/view/daily/worklog/worklog-daily-record-table.vue')
      },
      {
        path: 'worklog_sign_in',
        name: 'worklog_sign_in',
        meta: {
          icon: 'md-funnel',
          title: '签到记录'
        },
        component: () => import('@/view/daily/blank.vue')
      }
    ]
  },
  {
    path: '/organization',
    name: 'organization',
    meta: {
      icon: 'md-menu',
      title: '组织机构管理',
      access: ['COMPANY_ADMIN']
    },
    component: Main,
    children: [
      {
        path: 'org_employee',
        name: 'org_employee',
        meta: {
          icon: 'md-funnel',
          title: '员工管理',
          access: ['COMPANY_ADMIN']
        },
        component: () => import('@/view/daily/organization/org-employee-table.vue')
      },
      {
        path: 'org_team',
        name: 'org_team',
        meta: {
          icon: 'md-funnel',
          title: '团队管理',
          access: ['COMPANY_ADMIN']
        },
        component: () => import('@/view/daily/organization/org-team-table.vue')
      }
    ]
  },
  {
    path: '/customer',
    name: 'customer',
    meta: {
      icon: 'md-menu',
      title: '客户管理',
      access: ['COMPANY_ADMIN']
    },
    component: Main,
    children: [
      {
        path: 'customer_company',
        name: 'customer_company',
        meta: {
          icon: 'md-funnel',
          title: '客户公司管理',
          access: ['COMPANY_ADMIN']
        },
        component: () => import('@/view/daily/customer/customer-company-table.vue')
      },
      {
        path: 'customer_employee',
        name: 'customer_employee',
        meta: {
          icon: 'md-funnel',
          title: '客户员工管理',
          access: ['COMPANY_ADMIN']
        },
        component: () => import('@/view/daily/customer/customer-employee-table.vue')
      }
    ]
  },
  {
    path: '/project',
    name: 'project',
    meta: {
      icon: 'md-menu',
      title: '项目建设',
      access: ['TEAM_ADMIN']
    },
    component: Main,
    children: [
      {
        path: 'project_system',
        name: 'project_system',
        meta: {
          icon: 'md-funnel',
          title: '系统管理',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/project/project-system-table.vue')
      },
      {
        path: 'project_system_item',
        name: 'project_system_item',
        meta: {
          icon: 'md-funnel',
          title: '项目管理',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/project/project-system-item-table.vue')
      }
    ]
  },
  {
    path: '/statistics',
    name: 'statistics',
    meta: {
      icon: 'md-menu',
      title: '统计分析',
      access: ['TEAM_ADMIN']
    },
    component: Main,
    children: [
      {
        path: 'statistics_project_system_item_manhour',
        name: 'statistics_project_system_item_manhour',
        meta: {
          icon: 'md-funnel',
          title: '项目工时',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/statistics/project-system-item-manhour-table.vue')
      },
      {
        path: 'statistics_employee_manhour',
        name: 'statistics_employee_manhour',
        meta: {
          icon: 'md-funnel',
          title: '员工工时',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/statistics/employee-manhour-table.vue')
      },
      {
        path: 'statistics_worklog_summary',
        name: 'statistics_worklog_summary',
        meta: {
          icon: 'md-funnel',
          title: '日报汇总',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/statistics/worklog-summary-table.vue')
      },
      {
        path: 'statistics_worklog_finished',
        name: 'statistics_worklog_finished',
        meta: {
          icon: 'md-funnel',
          title: '已填写日报',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/blank.vue')
      },
      {
        path: 'statistics_worklog_missing',
        name: 'statistics_worklog_missing',
        meta: {
          icon: 'md-funnel',
          title: '未填写日报',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/blank.vue')
      },
      {
        path: 'statistics_worklog_approved',
        name: 'statistics_worklog_approved',
        meta: {
          icon: 'md-funnel',
          title: '已审批日报',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/blank.vue')
      },
      {
        path: 'statistics_worklog_noapproved',
        name: 'statistics_worklog_noapproved',
        meta: {
          icon: 'md-funnel',
          title: '未审批日报',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/blank.vue')
      }
    ]
  },
  {
    path: '/workload',
    name: 'workload',
    meta: {
      icon: 'md-menu',
      title: '工作量整理',
      access: ['TEAM_ADMIN']
    },
    component: Main,
    children: [
      {
        path: 'workload_manhour_settle',
        name: 'workload_manhour_settle',
        meta: {
          icon: 'md-funnel',
          title: '项目工时统计报表',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/workload/manhour-settle-table.vue')
      },
      {
        path: 'workload_team_quarter',
        name: 'workload_team_quarter',
        meta: {
          icon: 'md-funnel',
          title: '团队季度工时统计报表',
          access: ['TEAM_ADMIN']
        },
        component: () => import('@/view/daily/workload/team-quarter-table.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-menu',
      title: '系统管理',
      access: ['COMPANY_ADMIN']
    },
    component: Main,
    children: [
      {
        path: 'permission',
        name: 'permission',
        meta: {
          icon: 'md-funnel',
          title: '权限管理',
          access: ['COMPANY_ADMIN']
        },
        component: () => import('@/view/daily/system/permission.vue')
      },
      {
        path: 'holidays',
        name: 'holidays',
        meta: {
          icon: 'md-funnel',
          title: '假日管理',
          access: ['COMPANY_ADMIN']
        },
        component: () => import('@/view/daily/system/holidays.vue')
      }
    ]
  },
  {
    path: '/organization_form',
    name: 'organization_form',
    component: Main,
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '/org_employee_edit',
        name: 'org_employee_edit',
        meta: {
          icon: 'ios-create-outline',
          title: '员工编辑'
        },
        component: () => import('@/view/daily/organization/org-employee-form.vue')
      },
      {
        path: '/org_team_edit',
        name: 'org_team_edit',
        meta: {
          icon: 'ios-create-outline',
          title: '团队编辑'
        },
        component: () => import('@/view/daily/organization/org-team-form.vue')
      }
    ]
  },
  {
    path: '/customer_form',
    name: 'customer_form',
    component: Main,
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '/customer_company_edit',
        name: 'customer_company_edit',
        meta: {
          icon: 'ios-create-outline',
          title: '客户公司编辑'
        },
        component: () => import('@/view/daily/customer/customer-company-form.vue')
      },
      {
        path: '/customer_employee_edit',
        name: 'customer_employee_edit',
        meta: {
          icon: 'ios-create-outline',
          title: '客户员工编辑'
        },
        component: () => import('@/view/daily/customer/customer-employee-form.vue')
      }
    ]
  },
  {
    path: '/project_form',
    name: 'project_form',
    component: Main,
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '/project_system_edit',
        name: 'project_system_edit',
        meta: {
          icon: 'ios-create-outline',
          title: '系统编辑'
        },
        component: () => import('@/view/daily/project/project-system-form.vue')
      },
      {
        path: '/project_system_item_edit',
        name: 'project_system_item_edit',
        meta: {
          icon: 'ios-create-outline',
          title: '项目编辑'
        },
        component: () => import('@/view/daily/project/project-system-item-form.vue')
      }
    ]
  },
  {
    path: '/worklog_form',
    name: 'worklog_form',
    component: Main,
    meta: {
      hideInMenu: true
    },
    children: [
      {
        path: '/worklog_daily_record_edit',
        name: 'worklog_daily_record_edit',
        meta: {
          icon: 'ios-create-outline',
          title: '日报编辑'
        },
        component: () => import('@/view/daily/worklog/worklog-daily-record-form.vue')
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
