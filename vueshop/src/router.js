import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/Login.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: () =>
                import ('./components/Home.vue'),
            redirect: '/home/welcome',
            children: [{
                    path: 'welcome',
                    component: () =>
                        import ('./components/Welcome.vue')
                },
                {
                    path: '/users',
                    component: () =>
                        import ('./components/Users/Users.vue')
                },
                {
                    path: '/roles',
                    component: () =>
                        import ('./components/Power/Roles.vue')
                },
                {
                    path: '/rights',
                    component: () =>
                        import ('./components/Power/Rights.vue')
                },
                {
                    path: '/categories',
                    component: () =>
                        import ('./components/Goods/Cate.vue')
                },
                {
                    path: '/params',
                    component: () =>
                        import ('./components/Goods/Params.vue')
                },
                {
                    path: '/goods',
                    component: () =>
                        import ('./components/Goods/Goods.vue')
                },
                {
                    path: '/goods/add',
                    component: () =>
                        import ('./components/Goods/Add.vue')
                },
                {
                    path: '/orders',
                    component: () =>
                        import ('./components/Orders/Orders.vue')
                },
                {
                    path: '/reports',
                    component: () =>
                        import ('./components/Reports/Reports.vue')
                }
            ]
        }
    ]
})


router.beforeEach((to, from, next) => {
    if (to.path == '/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
})


export default router