import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {

  const [state, setState] = useState('Admin')
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  // Doctor specific fields
  const [speciality, setSpeciality] = useState('General physician')
  const [degree, setDegree] = useState('')
  const [experience, setExperience] = useState('1 Year')

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (isForgotPassword) {
        const endpoint = state === 'Admin' ? '/api/admin/forgot-password' : '/api/doctor/forgot-password'
        const { data } = await axios.post(backendUrl + endpoint, { email, newPassword })
        if (data.success) {
          toast.success(data.message)
          setIsForgotPassword(false)
        } else {
          toast.error(data.message)
        }
        return
      }

      if (isSignUp) {
        if (state === 'Admin') {
          const { data } = await axios.post(backendUrl + '/api/admin/register', { name, email, password })
          if (data.success) {
            setAToken(data.token)
            localStorage.setItem('aToken', data.token)
          } else {
            toast.error(data.message)
          }
        } else {
          const { data } = await axios.post(backendUrl + '/api/doctor/register', { 
            name, email, password, speciality, degree, experience 
          })
          if (data.success) {
            setDToken(data.token)
            localStorage.setItem('dToken', data.token)
          } else {
            toast.error(data.message)
          }
        }
      } else {
        // Login Logic
        if (state === 'Admin') {
          const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
          if (data.success) {
            setAToken(data.token)
            localStorage.setItem('aToken', data.token)
          } else {
            toast.error(data.message)
          }
        } else {
          const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
          if (data.success) {
            setDToken(data.token)
            localStorage.setItem('dToken', data.token)
          } else {
            toast.error(data.message)
          }
        }
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> {isForgotPassword ? 'Reset Password' : isSignUp ? 'Registration' : 'Login'}</p>
        
        {isSignUp && (
          <div className='w-full '>
            <p>Full Name</p>
            <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
          </div>
        )}

        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>

        {isForgotPassword ? (
          <div className='w-full '>
            <p>New Password</p>
            <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
          </div>
        ) : (
          <div className='w-full '>
            <p>Password</p>
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
          </div>
        )}

        {isSignUp && state === 'Doctor' && (
          <>
            <div className='w-full '>
              <p>Speciality</p>
              <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border border-[#DADADA] rounded w-full p-2 mt-1'>
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className='w-full '>
              <p>Degree</p>
              <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
            </div>
            <div className='w-full '>
              <p>Experience</p>
              <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border border-[#DADADA] rounded w-full p-2 mt-1'>
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>
          </>
        )}

        <button className='bg-primary text-white w-full py-2 rounded-md text-base mt-2'>
          {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Login'}
        </button>

        {!isForgotPassword && (
          <p className='w-full text-center'>
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <span onClick={() => setIsSignUp(!isSignUp)} className='text-primary underline cursor-pointer'>
              {isSignUp ? 'Login here' : 'Sign up here'}
            </span>
          </p>
        )}

        <p className='w-full text-center'>
          <span onClick={() => { setIsForgotPassword(!isForgotPassword); setIsSignUp(false); }} className='text-primary underline cursor-pointer'>
            {isForgotPassword ? 'Back to Login' : 'Forgot Password?'}
          </span>
        </p>

        {
          state === 'Admin'
            ? <p>Doctor Login? <span onClick={() => { setState('Doctor'); setIsSignUp(false); setIsForgotPassword(false); }} className='text-primary underline cursor-pointer'>Click here</span></p>
            : <p>Admin Login? <span onClick={() => { setState('Admin'); setIsSignUp(false); setIsForgotPassword(false); }} className='text-primary underline cursor-pointer'>Click here</span></p>
        }
      </div>
    </form>
  )
}

export default Login
