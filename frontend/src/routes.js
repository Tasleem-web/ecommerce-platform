import Home from './pages/Home.vue'
import Product from './pages/Product.vue'
import Admin from './pages/Admin.vue'
import Unauthorized from './pages/Unauthorized.vue'

export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./pages/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./pages/Register.vue')
  },
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/product/:id',
    name: "product",
    component: Product,
    props: true
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAdmin: true }
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: Unauthorized
  }
]