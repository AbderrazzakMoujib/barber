// App.js
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingComponent from './components/BookingComponent/BookingComponent';
import Calendar from './components/Calendar/Calendar';
import LandingPage from './components/LandingPage/LandingPage';
import LoginForm from './components/LoginForm/LoginForm';
import SignInForm from './components/SignInForm/SignInForm';
import AppointmentScreen from './components/AppointmentScreen/AppointmentScreen';
import Reservation from './components/Reservation/Reservation';
import AppointmentBooking from './components/AppointmentBooking/AppointmentBooking';
import NotFound from './components/NotFound';
import AdminPage from './components/AdminPage/AdminPage';
import AdminLogin from './components/AdminLogin/AdminLogin';
import { ContextProvider } from './Context/Context';
import './App.css';

const router = createBrowserRouter(
  [
    { path: '/', element: <LandingPage /> },
    { path: '/booking', element: <BookingComponent /> },
    { path: '/login', element: <LoginForm /> },
    { path: '/sign-in', element: <SignInForm /> },
    { path: '/calendar', element: <Calendar /> },
    { path: '/appointment-screen', element: <AppointmentScreen /> },
    { path: '/reservation', element: <Reservation /> },
    { path: '/appointment-booking', element: <AppointmentBooking /> },
    { path:  '/admin-login', element: <AdminLogin />},
    { path: '/admin', element: <AdminPage /> },
    { path: '*', element: <NotFound /> }
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

const App = () => {
  return (
    <ContextProvider>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <RouterProvider router={router} />
    </ContextProvider>
  );
};

export default App;
