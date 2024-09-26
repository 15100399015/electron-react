import { CrownFilled, SmileFilled } from '@ant-design/icons';
import { createHashRouter, RouteObject } from 'react-router-dom';

import Layout from '../layout';
import Home from '../pages/Home';
import Member from '../pages/Member';

export const routes: RouteObject[] = [
  {
    path: '/welcome',
    name: '欢迎',
    icon: <SmileFilled />,
    element: <Home />,
  },
  {
    path: '/admin',
    name: '管理页',
    icon: <CrownFilled />,
    element: <Member />,
  },
];

const router = createHashRouter([
  { path: '/', element: <Layout />, children: routes },
]);

export default router;
