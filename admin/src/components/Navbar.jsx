import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { PharmacistContext } from '../context/PharmacistContext' // Import PharmacistContext
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const { pToken, setPToken } = useContext(PharmacistContext) // Access pharmacist token

  const navigate = useNavigate()

  const logout = () => {
    navigate('/') // Redirect to login page
    if (dToken) {
      setDToken('') 
      localStorage.removeItem('dToken')
    }
    if (aToken) {
      setAToken('') 
      localStorage.removeItem('aToken')
    }
    if (pToken) { // If pharmacist is logged in, remove pharmacist token
      setPToken('') 
      localStorage.removeItem('pToken')
    }
  }

  // Determine the role of the user and display it accordingly
  let role = ''
  if (aToken) role = 'Admin'
  else if (dToken) role = 'Doctor'
  else if (pToken) role = 'Pharmacist'

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-2 text-xs'>
        <img onClick={() => navigate('/')} className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{role ? role : 'Guest'}</p> {/* Display role dynamically */}
      </div>
      <button onClick={logout} className='bg-blue-500 text-white text-sm px-10 py-2 rounded-full'>
        Logout
      </button>
    </div>
  )
}

export default Navbar