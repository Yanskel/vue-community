import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/LoginRegister')
  },
  {
    path: '/complete',
    name: 'complete',
    component: () => import('@/views/CompleteInfo')
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
        path: '/supApplication',
        name: 'supApplication',
        component: () => import('@/views/SupApplication'),
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
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
