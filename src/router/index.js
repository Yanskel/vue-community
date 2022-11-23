import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'userLogin',
    component: () => import('@/views/LoginRegister')
  },
  {
    path: '/complete',
    name: 'complete',
    component: () => import('@/views/CompleteInfo')
  },
  {
    path:'/adminLogin',
    name:'adminLogin',
    component: ()=> import('@/views/AdminLogin')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import('@/views/MainMenu'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/HomePage')
      },
      {
        path: '/health',
        name: 'health',
        component: () => import('@/views/HealthPage'),
      },
      {
        path: '/healthRecord',
        name: 'healthRecord',
        component: () => import('@/views/HealthRecord'),
      },
      {
        path: '/personalHealth',
        name: 'personalHealth',
        component: () => import('@/views/PersonalHealth'),
      },
      {
        path: '/supManage',
        name: 'supManage',
        component: () => import('@/views/SupManage'),
      },
      {
        path: '/announcement',
        name: 'announcement',
        component: () => import('@/views/AnnouncementPage'),
      },
      {
        path: '/supApprove',
        name: 'supApprove',
        component: () => import('@/views/SupApprove'),
      },
      {
        path: '/record',
        name: 'record',
        component: () => import('@/views/RecordPage'),
      },
      {
        path: '/residentManage',
        name: 'residentManage',
        component: () => import('@/views/ResidentManage'),
      },
      {
        path: '/employeeManage',
        name: 'employeeManage',
        component: () => import('@/views/EmployeeManage'),
      },
      {
        path: '/personalApply',
        name: 'personalApply',
        component: () => import('@/views/PersonalApply'),
      },
      {
        path: '/personalCenter',
        name: 'personalCenter',
        component: () => import('@/views/PersonalCenter'),
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
