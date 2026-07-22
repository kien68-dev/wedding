import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import AdminPage from '@/pages/AdminPage';
import CustomerPage from '@/pages/CustomerPage';
import WeddingEventPage from '@/pages/WeddingEventPage';
import GuestPage from '@/pages/GuestPage';
import ContractPage from '@/pages/ContractPage';
import PaymentPage from '@/pages/PaymentPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import PageTransition from '@/components/PageTransition';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
      <Route path="/dashboard" element={<ProtectedRoute><PageTransition><DashboardPage /></PageTransition></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><PageTransition><AdminPage /></PageTransition></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><PageTransition><CustomerPage /></PageTransition></ProtectedRoute>} />
      <Route path="/wedding-events" element={<ProtectedRoute><PageTransition><WeddingEventPage /></PageTransition></ProtectedRoute>} />
      <Route path="/guests" element={<ProtectedRoute><PageTransition><GuestPage /></PageTransition></ProtectedRoute>} />
      <Route path="/contracts" element={<ProtectedRoute><PageTransition><ContractPage /></PageTransition></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><PageTransition><PaymentPage /></PageTransition></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
