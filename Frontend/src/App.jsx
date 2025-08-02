import React, { useState } from 'react'
import Navbar from './components/Navbar.jsx';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Footer from './components/Footer.jsx';
import AllRooms from './pages/AllRooms.jsx';
import RoomDetails from './pages/RoomDetails.jsx';
import MyBookings from './pages/MyBookings.jsx';
import HotelReg from './components/HotelReg.jsx';
import Layout from './pages/hotelOwner/Layout.jsx';
import Dashboard from './pages/hotelOwner/Dashboard.jsx';
import AddRoom from './pages/hotelOwner/AddRoom.jsx';
import ListRoom from './pages/hotelOwner/ListRoom.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';
import About from './pages/About.jsx';
import Experience from './pages/Experience.jsx';
import VerifyEmail from './components/VerifyEmail.jsx';
import { Toaster } from 'react-hot-toast';


const App = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const isOwnerPath = useLocation().pathname.includes("owner"); 
  
  return (
    <div>

      <Toaster position="top-center" />
      {!isOwnerPath && <Navbar onLoginClick={() => setShowLoginModal(true)} onRegisterClick={() => setShowRegisterModal(true)} />} 
      {false && <HotelReg />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/about' element={<About />} />
          <Route path='/experience' element={<Experience />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/owner' element= {<Layout/>}>
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
          </Route>
        </Routes>

      </div>
      <Footer />
      
      {/* Login Modal */}
      {showLoginModal && (
        <LoginForm 
          onClose={() => setShowLoginModal(false)}
          onSwitchToRegister={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}
      
      {/* Registration Modal */}
      {showRegisterModal && (
        <RegistrationForm 
          onClose={() => setShowRegisterModal(false)}
          onSwitchToLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}
    </div>
  )
}

export default App

