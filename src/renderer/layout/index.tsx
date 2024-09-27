import { Link, Outlet, useLocation } from 'react-router-dom';
import { ProLayout, PageContainer } from '@ant-design/pro-components';
import { SmileFilled } from '@ant-design/icons';
function Layout() {
  const location = useLocation();

  return (
    <ProLayout
      siderWidth={180}
      title="家谱系统"
      contentStyle={{ padding: 0 }}
      route={{
        path: '/',
        routes: [
          {
            path: '/pedigree',
            name: '世系图',
            icon: <SmileFilled />,
          },
          {
            path: '/member/list',
            name: '人员管理',
            icon: <SmileFilled />,
          },
        ],
      }}
      location={{ pathname: location.pathname }}
      menuItemRender={(item, defaultDom) => {
        return <Link to={item.path as string}>{defaultDom}</Link>;
      }}
    >
      <Outlet />
    </ProLayout>
  );
}

export default Layout;
