import { RouteRecordRaw } from 'vue-router';
import { Layout } from '@/router/constant';
import { LogoWechat } from '@vicons/ionicons5';
import { renderIcon } from '@/utils/index';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/chat',
    name: 'ChatRoot',
    component: Layout,
    meta: {
      title: 'AI',
      icon: renderIcon(LogoWechat),
      sort: 1,
    },
    children: [
      {
        path: '/chat/index',
        name: 'Chat',
        meta: {
          title: '聊天',
        },
        component: () => import('@/views/chat/index.vue'),
      },
    ],
  },
];

export default routes;
