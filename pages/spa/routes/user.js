import User from '../views/user/user';
import UserFollowerAndFans from "../../lib/vue/publicVue/userFollowAndFans/UserFollowerAndFans";
import UserMoment from "../views/user/propfile/profile/UserMoment";
import UserPostList from "../views/user/propfile/profile/UserPostList";
import Subscribe from "../views/user/subscribe/Subscribe";
import ProfileView from "../views/user/propfile/ProfileView";
import Profile from "../views/user/propfile/profile/Profile";
import SubscribeColumns from "../views/user/subscribe/SubscribeColumns";
import SubscribeBlacklist from "../views/user/subscribe/SubscribeBlacklist";
import SubscribeUsers from "../views/user/subscribe/SubscribeUsers";
import SubscribeForums from "../views/user/subscribe/SubscribeForums";
import SubscribeCollection from "../views/user/subscribe/SubscribeCollection";
import Finance from "../views/user/propfile/profile/Finance";
import UserColumnThread from "../views/user/propfile/profile/UserColumnThread";
export const routerName = {
  user: 'userHome',
  follower: 'follower',
  fan: 'fan',
  moment: 'moment',
  post: 'post',
  blacklist: 'blacklist',
  subscribe: 'subscribe',
  thread: 'thread',
  profile: 'profile',
  accountUser: 'accountUser',
  subColumns: 'subColumns',
  subUsers: 'subUsers',
  subForums: 'subForums',
  subThreads: 'subThreads',
  profileView: 'profileView',
  subCollection: 'subCollection',
  finance: 'finance',
  column: 'column',
}

export default [
  {
    name: routerName.user,
    path: '/u/:uid',
    redirect: '/u/:uid/profile/moment',
    component: User,
    children: [
      {
        name: routerName.profileView,
        path: '/u/:uid/profile',
        component: ProfileView,
        redirect: '/u/:uid/profile/moment',
        children: [
          {
            name: routerName.profile,
            path: '/',
            redirect: '/u/:uid/profile/moment',
            component: Profile,
            children: [
              {
                name: routerName.moment,
                path: '/u/:uid/profile/moment',
                component: UserMoment,
              },
              {
                name: routerName.post,
                path: '/u/:uid/profile/post',
                component: UserPostList
              },
              {
                name: routerName.thread,
                path: '/u/:uid/profile/thread',
                component: UserPostList
              },
              {
                name: routerName.follower,
                path: '/u/:uid/profile/follower',
                component: UserFollowerAndFans,
                props: { pageType: "follower" }
              },
              {
                name: routerName.fan,
                path: '/u/:uid/profile/fan',
                component: UserFollowerAndFans,
                props: { pageType: "fan" }
              },
              {
                name: routerName.column,
                path: '/u/:uid/profile/column',
                component: UserColumnThread,
              }
            ]
          },
          {
            name: routerName.subscribe,
            path: '/u/:uid/profile/subscribe',
            component: Subscribe,
            children: [
              {
                name: routerName.blacklist,
                path: '/u/:uid/profile/subscribe/blacklist',
                component: SubscribeBlacklist,
              },
              {
                name: routerName.subColumns,
                path: '/u/:uid/profile/subscribe/column',
                component: SubscribeColumns,
              },
              {
                name: routerName.subForums,
                path: '/u/:uid/profile/subscribe/forum',
                component: SubscribeForums,
              },
              {
                name: routerName.subUsers,
                path: '/u/:uid/profile/subscribe/user',
                component: SubscribeUsers,
              },
              {
                name: routerName.subCollection,
                path: '/u/:uid/profile/subscribe/collection',
                component: SubscribeCollection,
              }
            ]
          }
        ]
      },
      {
        name: routerName.finance,
        path: '/u/:uid/profile/finance',
        component: Finance,
      },
    ],
    
  }
]

