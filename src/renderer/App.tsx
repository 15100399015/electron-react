import { RouterProvider } from 'react-router-dom';
import router from './router';
import './global.less';

export function App() {
  return <RouterProvider router={router} />;
}
