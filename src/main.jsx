import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StylesPage from './pages/StylesPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import BookPage from './pages/BookPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="styles" element={<StylesPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="book" element={<BookPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="admin" element={<AdminPage />} />
        </Routes>
      </SiteProvider>
    </BrowserRouter>
  </StrictMode>
);
