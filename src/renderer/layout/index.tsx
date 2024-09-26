import { Link, Outlet, useLocation } from 'react-router-dom';
import { ProLayout, PageContainer } from '@ant-design/pro-components';
import { routes } from '../router';

function Layout() {
  const location = useLocation();

  return (
    <div style={{ height: '100vh' }}>
      <ProLayout
        logo={false}
        contentStyle={{ padding: 0 }}
        route={{ path: '/', routes }}
        location={{ pathname: location.pathname }}
        menuItemRender={(item, defaultDom) => {
          return <Link to={item.path as string}>{defaultDom}</Link>;
        }}
      >
        <PageContainer>
          <Outlet />
        </PageContainer>
      </ProLayout>
    </div>
  );
}

export default Layout;
