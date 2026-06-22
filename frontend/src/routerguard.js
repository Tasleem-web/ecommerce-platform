import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import store from './store/index'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!store.getters['userModule/currentUser'];
  const isAdmin = store.getters['userModule/isAdmin'];

  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (isAuthenticated && isAdmin) {
      return next();
    }
    return next({ name: 'unauthorized' });
  }

  if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    return next({ name: 'home' });
  }

  next();
})

export default router
