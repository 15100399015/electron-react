import { createHashRouter } from 'react-router-dom';

import { Layout } from '../layout';
import { MemberDetail } from '../pages/MemberDetail';
import { MemberList } from '../pages/MemberList';
import { Pinboard } from '../pages/Pinboard';

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        Component: Pinboard,
      },
      {
        path: '/list',
        Component: MemberList,
      },
    ],
  },
  {
    path: '/detail/:memberId',
    Component: MemberDetail,
  },
]);

export default router;
