import Home from './pages/Home.vue'
import Product from './pages/Product.vue'
import Admin from './pages/Admin.vue'
import Unauthorized from './pages/Unauthorized.vue'
import ProductCatalog from './pages/ProductCatalog.vue'
import ProductConfiguration from './pages/ProductConfiguration.vue'
import Cart from './pages/Cart.vue'
import Wishlist from './pages/Wishlist.vue'

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
    props: true,
  },
  {
    path: '/product/edit/:id',
    name: "product-edit",
    component: ProductConfiguration,
    props: true,
  },
  {
    path: '/product/add',
    name: "product-add",
    component: ProductConfiguration,
    props: true,
  },
  {
    path: '/products',
    name: "products",
    component: ProductCatalog,
    meta: { requiresAdmin: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
    meta: { requiresAdmin: true }
  },
  {
    path: '/cart',
    name: 'cart',
    component: Cart
  },
  {
    path: '/wishlist',
    name: 'wishlist',
    component: Wishlist
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: Unauthorized
  }
]