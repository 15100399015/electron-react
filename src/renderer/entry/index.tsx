import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from '../router';
import '../global.less';

export function App() {
  return <RouterProvider router={router} />;
}

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);
