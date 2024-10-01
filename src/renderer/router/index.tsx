import { createHashRouter } from 'react-router-dom';

import Layout from '../layout';
import PageNotFound from '../layout/PageNotFound';
import MemberDetail from '../pages/MemberDetail';
import MemberList from '../pages/MemberList';
import Pinboard from '../pages/Pinboard';

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        Component: Pinboard,
      },
      {
        path: '/member/list',
        Component: MemberList,
      },
      {
        path: '/member/detail/:memberId',
        Component: MemberDetail,
      },
    ],
  },
  {
    path: '/*',
    Component: PageNotFound,
  },
]);

export default router;
