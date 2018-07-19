import Vue from 'vue'
import Router from 'vue-router'
import Index from 'VIEW/index'
// import UserPage from 'VIEW/user/userpage'
// import RepoList from 'VIEW/user/repos'
// import RepoDetail from 'VIEW/user/detail'
// import Github from 'VIEW/Index/github'
// import Novelty from 'VIEW/github/novelty'
// import Repos from 'VIEW/github/repos'
// import Owner from 'VIEW/github/owner'
// import Follow from 'VIEW/github/follow'
import Error from 'VIEW/404/404'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/Index'
      // redirect: '/User'
    },
    {
      path: '/Index',
      name: 'Index',
      component: Index
    },
    // {
    //   path: '/Github',
    //   name: 'Github',
    //   component: Github,
    //   children: [
    //     {
    //       path: 'Novelty',
    //       name: 'Novelty',
    //       component: Novelty
    //     },
    //     {
    //       path: 'Repos',
    //       name: 'Repos',
    //       component: Repos
    //     },
    //     {
    //       path: 'Owner',
    //       name: 'Owner',
    //       component: Owner
    //     },
    //     {
    //       path: 'Follow',
    //       name: 'Follow',
    //       component: Follow
    //     }
    //   ]
    // },
    // {
    //   path: '/User',
    //   name: 'User',
    //   component: User,
    //   redirect: {
    //     name: 'UserDetail',
    //     params: {
    //       username: 'luuman'
    //     }
    //   },
    //   children: [
    //     {
    //       path: ':username',
    //       name: 'UserDetail',
    //       component: UserPage
    //     },
    //     {
    //       path: ':username/repos',
    //       name: 'RepoList',
    //       component: RepoList
    //     },
    //     {
    //       path: ':username/repos/:reponame',
    //       name: 'RepoDetail',
    //       component: RepoDetail
    //     }
    //   ]
    // },
    {
      path: '/404',
      name: 'Error',
      component: Error
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
