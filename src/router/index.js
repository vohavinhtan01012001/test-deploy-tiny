import { createRouter, createWebHistory } from 'vue-router';
import EmptyLayout from "@/layouts/empty.vue";
import DefaultLayout from "@/layouts/default.vue";
import MixedLayout from "@/layouts/mixed.vue";
import { useUserStore } from "@/stores/user";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home.vue'),
      meta: {
        layout: DefaultLayout,
        authRequired: true
      }
    },
    // {
    //   path: '/discord',
    //   name: 'discord',
    //   component: () => import('../views/discord-redirect.vue'),
    //   meta: {
    //     layout: EmptyLayout,
    //   }
    // },
    {
      path: '/service',
      name: 'service',
      component: () => import('../views/service.vue'),
      meta: {
        layout: DefaultLayout,
        authRequired: true
      }
    },
    {
      path: '/share',
      name: 'share',
      component: () => import('../views/share.vue'),
      meta: {
        layout: DefaultLayout,
        authRequired: true
      }
    },
    {
      path: '/giftcode',
      name: 'giftcode',
      component: () => import('../views/giftcode.vue'),
      meta: {
        layout: DefaultLayout,
        authRequired: true
      }
    },
    {
      path: '/support',
      name: 'support',
      component: () => import('../views/support.vue'),
      meta: {
        layout: DefaultLayout,
        authRequired: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/profile.vue'),
      meta: {
        layout: DefaultLayout,
        authRequired: true,
        parent: "setting"
      }
    },
    {
      path: '/affiliate-history',
      name: 'affiliate-history',
      component: () => import('../views/affiliate-history.vue'),
      meta: {
        layout: DefaultLayout,
        authRequired: true,
        parent: "setting"
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
      meta: {
        layout: EmptyLayout
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register.vue'),
      meta: {
        layout: EmptyLayout
      }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/forgot-password.vue'),
      meta: {
        layout: EmptyLayout
      }
    },
    {
      path: '/confirm-email',
      name: 'confirm-email',
      component: () => import('../views/confirm-email.vue'),
      meta: {
        layout: MixedLayout
      }
    },
    {
      path: '/all-game',
      component: () => import('../components/home/AllGame.vue'),
      meta: {
        layout: DefaultLayout,
        authRequired: true
      }
    },
    {
      path: '/:pathMatch(.*)*', redirect: "/"
    }
  ]
});

router.beforeEach((to, from) => {
  const userStore = useUserStore();
  let token = localStorage.getItem("accessToken");
  let isWebPlatform = userStore.isWebPlatform;
  // if(to.name != "login" && to.name != "register" && !token) {
  if (to.meta.authRequired && !token) {
    return { name: "login" };
  } else if (to.name == "login" && token) {
    // if(isWebPlatform) {
    //   return { name: "service" };
    // }
    return { name: "home" };
  }
  // if(isWebPlatform && to.name == "home") {
  //   return { name: "service" };
  // }
  return true;
});

export default router
