import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home/Home'
import Library from '../views/Library/Library'
import Themes from '../views/Themes/Themes'
import Profile from '../views/Profile/Profile'
import Settings from '../views/Settings/Settings'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Library',
    name: 'Library',
    component: Library
  },
  {
    path: '/Themes',
    name: 'Themes',
    component: Themes
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/Settings',
    name: 'Settings',
    component: Settings
  }
]

const router = new VueRouter({
  routes
})

export default router