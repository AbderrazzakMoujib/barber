import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion'; // Importer AnimatePresence pour les animations
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
import Language from './components/Language/language';
import AdminAppel from './components/AdminAppel/AdminAppel';
import { ContextProvider } from './Context/Context';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation(); // Utiliser useLocation pour suivre les changements de route

  return (
    <AnimatePresence mode="wait"> {/* Mode "wait" pour attendre la fin de l'animation */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/language" element={<Language />} />
        <Route path="/booking" element={<BookingComponent />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/appointment-screen" element={<AppointmentScreen />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/appointment-booking" element={<AppointmentBooking />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-appels" element={<AdminAppel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <ContextProvider>
      <BrowserRouter> {/* Envelopper l'application avec BrowserRouter */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <AnimatedRoutes /> {/* Utiliser AnimatedRoutes pour gérer les routes */}
      </BrowserRouter>
    </ContextProvider>
  );
};

export default App;
