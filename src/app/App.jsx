import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MainLayout from '../presentation/layouts/MainLayout';
import HomePage from '../presentation/pages/HomePage';
import RegistrationPage from '../presentation/pages/RegistrationPage';
import NotFoundPage from '../presentation/pages/NotFoundPage';
import { ROUTES } from '../shared/constants/routes';
import RouteTransition from '../presentation/layouts/RouteTransition';

// Data routing enables native view transitions; BASE_URL preserves subpath hosting.
const router = createBrowserRouter(createRoutesFromElements(
  <Route element={<RouteTransition />}>
    <Route path={ROUTES.home} element={<HomePage />} />
    <Route path={ROUTES.registration} element={<RegistrationPage />} />
    <Route element={<MainLayout />}>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Route>
), { basename: import.meta.env.BASE_URL });

export default function App() {
  return <RouterProvider router={router} />;
}
