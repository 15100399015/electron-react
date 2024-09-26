import { RouterProvider } from 'react-router-dom';
import router from './router';
import './global.less';

export default function App() {
  return <RouterProvider router={router} />;
}
