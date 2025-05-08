import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { PharmacistContext } from '../context/PharmacistContext'; // Import PharmacistContext
import axios from 'axios';

const Sidebar = () => {
  const { dToken } = useContext(DoctorContext);
  const { aToken } = useContext(AdminContext);
  const { pToken } = useContext(PharmacistContext); // Access pharmacist token

  // State to store the count of new appointments
  const [newAppointments, setNewAppointments] = useState(0);

  // Function to fetch new appointments count
  const fetchNewAppointments = async () => {
    try {
      let response;
      if (aToken) {
        response = await axios.get('/api/admin/new-appointments', { headers: { token: aToken } });
      } else if (dToken) {
        response = await axios.get('/api/doctor/new-appointments', { headers: { token: dToken } });
      }
      // else if (pToken) {
      //   response = await axios.get('/api/pharmacist/new-appointments', { headers: { token: pToken } });

      if (response?.data?.newAppointmentsCount !== undefined) {
        setNewAppointments(response.data.newAppointmentsCount);
      }
    } catch (error) {
      console.error('Error fetching new appointments:', error);
    }
  };

  // Fetch new appointments on component mount and then every 30 seconds
  useEffect(() => {
    fetchNewAppointments();
    const interval = setInterval(fetchNewAppointments, 30000);
    return () => clearInterval(interval);
  }, [aToken, dToken]);

  return (
    <div className='min-h-screen bg-white border-r'>
      {/* Sidebar for Admin */}
      {aToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink to={'/admin-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          {/* Appointments Link with Badge */}
          <NavLink to={'/all-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block'>Appointments</p>
            {newAppointments > 0 && <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto'>{newAppointments}</span>}
          </NavLink>
          
          {/* Other Admin Links */}
          <NavLink to={'/add-doctor'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.add_icon} alt='' />
            <p className='hidden md:block'>Add Doctor</p>
          </NavLink>
          <NavLink to={'/add-pharmacist'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.add_icon} alt='' />
            <p className='hidden md:block'>Add Pharmacist</p>
          </NavLink>
          <NavLink to={'/payments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.add_icon} alt='' />
            <p className='hidden md:block'>Payments</p>
          </NavLink>
          <NavLink to={'/doctor-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Doctors List</p>
        </NavLink>
        <NavLink to={'/pharmacist-list'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`}>
          <img className='min-w-5' src={assets.people_icon} alt='' />
          <p className='hidden md:block'>Pharmacists List</p>
        </NavLink>
        </ul>
      )}

      {/* Sidebar for Doctor */}
      {dToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink to={'/doctor-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          {/* Appointments Link with Badge */}
          <NavLink to={'/doctor-appointments'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block'>Appointments</p>
            {newAppointments > 0 && <span className='bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-auto'>{newAppointments}</span>}
          </NavLink>
          
          {/* Other Doctor Links */}
          <NavLink to={'/doctor-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      )}

      {/* Sidebar for Pharmacist */}
      {pToken && (
        <ul className='text-[#515151] mt-5'>
          <NavLink to={'/pharmacist-dashboard'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.home_icon} alt='' />
            <p className='hidden md:block'>Dashboard</p>
          </NavLink>

          {/* Prescriptions Link */}
          <NavLink to={'/pharmacist-Appointment'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.appointment_icon} alt='' />
            <p className='hidden md:block'>Appointments</p>
          </NavLink>

          {/* Orders Link */}
          <NavLink to={'/orders'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.orders_icon} alt='' />
            <p className='hidden md:block'>Orders</p>
          </NavLink>

          {/* Pharmacist Profile */}
          <NavLink to={'/pharmacist-profile'} className={({ isActive }) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-300' : ''}`}>
            <img className='min-w-5' src={assets.people_icon} alt='' />
            <p className='hidden md:block'>Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;