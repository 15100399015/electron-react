import { createHashRouter } from 'react-router-dom';

import Layout from '../layout';
import MemberDetail from '../pages/MemberDetail';
import MemberList from '../pages/MemberList';
import Pedigree from '../pages/Pedigree';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/pedigree',
        element: <Pedigree />,
      },
      {
        path: '/member/list',
        element: <MemberList />,
      },
      {
        path: '/member/detail/:memberId',
        element: <MemberDetail />,
      },
    ],
  },
]);

export default router;
