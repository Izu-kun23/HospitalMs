import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Footer from './components/Footer'
import AppointmentForm from './components/AppointmentForm'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Verify from './pages/Verify'
import Pharmacists from './pages/Pharmacists'
import PharmAppointment from './pages/PharmAppointment'
import ChatBot from './components/Chatbot' // Import the ChatBot component

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/pharmacists' element={<Pharmacists />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/pharmacists/:speciality' element={<Pharmacists />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/pharm-appointment/:pharmacistId' element={<PharmAppointment />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />

        <Route path="/appointment-form/:appointmentId" element={<AppointmentForm />} />
        <Route path='/verify' element={<Verify />} />
      </Routes>
      
      <Footer />

      {/* Add the ChatBot component here */}
      <ChatBot />
    </div>
  )
}

export default App