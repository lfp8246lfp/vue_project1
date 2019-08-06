import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

import NProgress from 'nprogress'

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)


Vue.filter('dateformat', function(time) {
    let date = new Date(time * 1000)
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let h = date.getHours()
    let mm = date.getMinutes()
    let s = date.getSeconds()
    return `${y}-${m}-${d} ${h}:${mm}:${s}`
})

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1'

//axios请求拦截器
axios.interceptors.request.use(function(config) {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
}, function(error) {
    console.log(error)
})

axios.interceptors.response.use(config => {
    NProgress.done()
    return config
}, function(error) {
    console.log(error)
})


Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')