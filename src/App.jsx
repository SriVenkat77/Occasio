import { Route, Routes } from 'react-router-dom';
import './App.css';
import IndexPage from './pages/IndexPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './Layout';
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import { UserContextProvider } from './UserContext';
import UserAccountPage from './pages/UserAccountPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AddEvent from './pages/AddEvent';
import EventPage from './pages/EventPage';
import CalendarView from './pages/CalendarView';
import OrderSummary from './pages/OrderSummary';
import PaymentSummary from './pages/PaymentSummary';
import AdminDashboard from './pages/Admin'; // Updated
import TicketPage from './pages/TicketPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider> 
      {/* Toaster for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path='/useraccount' element={<UserAccountPage />} />
          <Route path='/event/:id' element={<EventPage />} />
          <Route path='/calendar' element={<CalendarView />} />
          <Route path='/wallet' element={<TicketPage />} />
          <Route path='/event/:id/ordersummary' element={<OrderSummary />} />
        </Route>

        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
        <Route path='/resetpassword' element={<ResetPassword />} />
        <Route path='/event/:id/ordersummary/paymentsummary' element={<PaymentSummary />} />

        {/* Protected Admin Routes */}
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/createEvent' element={ <AddEvent /> } />
       
      </Routes>
    </UserContextProvider>  
  );
}

export default App;
