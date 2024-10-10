import { createHashRouter } from 'react-router-dom';

import { Layout } from '../layout';

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        lazy: async () => {
          const res = await import('../pages/Pinboard');
          return { Component: res.Pinboard };
        },
      },
      {
        path: '/list',
        lazy: async () => {
          const res = await import('../pages/MemberList');
          return { Component: res.MemberList };
        },
      },
    ],
  },
]);

export default router;
