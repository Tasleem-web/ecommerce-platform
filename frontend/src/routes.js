import Home from './pages/Home.vue'
import Product from './pages/Product.vue'
import Admin from './pages/Admin.vue'
import Unauthorized from './pages/Unauthorized.vue'

export default [
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