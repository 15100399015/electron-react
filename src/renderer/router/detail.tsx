import { createHashRouter } from 'react-router-dom';

const router = createHashRouter([
  {
    path: '/:memberId',
    lazy: async () => {
      const res = await import('../pages/MemberDetail');
      return { Component: res.MemberDetail };
    },
  },
]);

export default router;
