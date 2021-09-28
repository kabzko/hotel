import { createRouter, createWebHistory } from '@ionic/vue-router';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/information',
    name: 'Information',
    component: () => import('@/views/Information.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/location',
    name: 'Location',
    component: () => import('@/views/Location.vue')
  },
  {
    path: '/coordinator',
    name: 'Coordinator',
    component: () => import('@/views/Coordinator.vue')
  },
  {
    path: '/store',
    name: 'Store',
    component: () => import('@/views/Store.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/stores',
    name: 'Stores',
    component: () => import('@/views/Stores.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@/views/Product.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/Products.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/booked',
    name: 'Booked',
    component: () => import('@/views/Booked.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/bookeddetail',
    name: 'BookedDetail',
    component: () => import('@/views/BookedDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('@/views/Wallet.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/searchshores',
    name: 'SearchShoRes',
    component: () => import('@/views/SearchShoRes.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
