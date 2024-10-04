import { Link, Outlet, useLocation } from 'react-router-dom';
import { ProLayout } from '@ant-design/pro-components';
import { ApartmentOutlined, BarsOutlined } from '@ant-design/icons';
import logo from '../../../assets/icon.png'
export function Layout() {
  const location = useLocation();

  return (
    <ProLayout
      siderWidth={180}
      title="家谱系统"
      logo={logo}
      contentStyle={{ padding: 0 }}
      collapsed
      collapsedButtonRender={false}
      route={{
        routes: [
          {
            path: '/',
            name: '数据看板',
            icon: <ApartmentOutlined />,
          },
          {
            path: '/member/list',
            name: '人员管理',
            icon: <BarsOutlined />,
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
