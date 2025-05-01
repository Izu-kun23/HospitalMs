import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { PharmacistContext } from '../context/PharmacistContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom' // Import useNavigate

const Login = () => {
  const [state, setState] = useState('Admin') // Track user role
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)
  const { setPToken } = useContext(PharmacistContext)

  const navigate = useNavigate() // Initialize navigate function

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
          navigate('/admin-dashboard') // Redirect to admin dashboard
        } else {
          toast.error(data.message)
        }
      } else if (state === 'Doctor') {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
          navigate('/doctor-dashboard') // Redirect to doctor dashboard
        } else {
          toast.error(data.message)
        }
      } else if (state === 'Pharmacist') {
        const { data } = await axios.post(backendUrl + '/api/pharmacists/login', { email, password })
        if (data.success) {
          setPToken(data.token)
          localStorage.setItem('pToken', data.token)
          navigate('/pharmacist-dashboard') // Redirect to pharmacist dashboard
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error("An error occurred during login. Please try again.")
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-blue-600'>{state}</span> Login</p>
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>
        <div className='w-full '>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>
        <button className='bg-blue-600 text-white w-full py-2 rounded-md text-base'>Login</button>

        {/* Updated toggle links to include Pharmacist */}
        {state === 'Admin' ? (
          <p>Doctor Login? <span onClick={() => setState('Doctor')} className='text-blue-600 underline cursor-pointer'>Click here</span></p>
        ) : state === 'Doctor' ? (
          <p>Pharmacist Login? <span onClick={() => setState('Pharmacist')} className='text-blue-600 underline cursor-pointer'>Click here</span></p>
        ) : (
          <p>Admin Login? <span onClick={() => setState('Admin')} className='text-blue-600 underline cursor-pointer'>Click here</span></p>
        )}
      </div>
    </form>
  )
}

export default Login