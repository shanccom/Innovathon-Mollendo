import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from '../presentation/layouts/MainLayout';
import HomePage from '../presentation/pages/HomePage';
import RegistrationPage from '../presentation/pages/RegistrationPage';
import NotFoundPage from '../presentation/pages/NotFoundPage';
import { ROUTES } from '../shared/constants/routes';

// Application root: routing and layout composition only.
export default function App() {
  // BASE_URL keeps routes working both on the project site and on the custom domain.
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path={ROUTES.registration} element={<RegistrationPage />} />
        <Route element={<MainLayout />}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
