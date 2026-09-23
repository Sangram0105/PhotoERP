import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import Toast from '../components/ui/Toast';
import { AppLockProvider } from '../features/security/context/AppLockContext';

const App = () => {
  return (
    <AppLockProvider>
      <Toast />

      <RouterProvider router={router} />
    </AppLockProvider>
  );
};

export default App;