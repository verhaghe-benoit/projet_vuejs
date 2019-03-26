import Vue from 'vue'
import Home from '@/components/Home'
import MyList from '@/components/MyList'
import Lists from '@/components/Lists'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/lists', component: Lists },
  { path: '/lists/:name', component: MyList }
]


export default new VueRouter({
  routes
})


