import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import TransactionView from '../views/TransactionView.vue'
import CategoryConfigView from '../views/CategoryConfigView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: TransactionView,
  },
  {
    path: '/categories',
    name: 'Categories',
    component: CategoryConfigView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
