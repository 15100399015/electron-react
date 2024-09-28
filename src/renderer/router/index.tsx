import { createHashRouter } from 'react-router-dom';

import Layout from '../layout';
import MemberDetail from '../pages/MemberDetail';
import MemberList from '../pages/MemberList';
import Pedigree from '../pages/Pedigree';

const router = createHashRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        Component: Pedigree,
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
]);

export default router;
