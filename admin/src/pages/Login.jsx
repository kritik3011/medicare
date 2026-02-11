import axios from 'axios'
import { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-white to-indigo-50'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-100 backdrop-blur-sm bg-white/90'>
        <div className='text-center'>
          <img src={assets.admin_logo} alt="MediCare Logo" className='mx-auto h-16 w-auto mb-4 border rounded-lg' />
          <div className='flex justify-center mb-4'>
            <div className='bg-primary/10 px-4 py-1 rounded-full text-xs font-semibold text-primary uppercase tracking-wider'>
              {state} Portal
            </div>
          </div>
          <p className='text-3xl font-extrabold text-gray-900 tracking-tight'>
            {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : 'Welcome Back'}
          </p>
          <p className='mt-2 text-sm text-gray-600 font-medium'>
            {isForgotPassword ? 'Securely reset your portal password' : isSignUp ? `Register as a ${state}` : `Please log in to your ${state} account`}
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={onSubmitHandler}>
          <div className='rounded-md shadow-sm space-y-4'>
            {isSignUp && (
              <div className='transition-all duration-300 transform translate-y-0'>
                <label className='block text-sm font-medium text-gray-700'>Full Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  className='appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200'
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className='block text-sm font-medium text-gray-700'>Email address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className='appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200'
                type="email"
                placeholder="email@medicare.com"
                required
              />
            </div>

            {isForgotPassword ? (
              <div>
                <label className='block text-sm font-medium text-gray-700'>New Password</label>
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  className='appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200'
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            ) : (
              <div>
                <label className='block text-sm font-medium text-gray-700'>Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className='appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200'
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {isSignUp && state === 'Doctor' && (
              <div className='space-y-4 pt-2 border-t border-gray-100'>
                <div className='grid grid-cols-1 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Speciality</label>
                    <select
                      onChange={(e) => setSpeciality(e.target.value)}
                      value={speciality}
                      className='mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg transition-all duration-200'
                    >
                      <option value="General physician">General physician</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Pediatricians">Pediatricians</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Gastroenterologist">Gastroenterologist</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Degree</label>
                    <input
                      onChange={(e) => setDegree(e.target.value)}
                      value={degree}
                      className='appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200'
                      type="text"
                      placeholder="e.g. MBBS, MD"
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>Experience</label>
                    <select
                      onChange={(e) => setExperience(e.target.value)}
                      value={experience}
                      className='mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg transition-all duration-200'
                    >
                      {[...Array(10).keys()].map(i => (
                        <option key={i + 1} value={`${i + 1} Year`}>{i + 1} Year</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]'
            >
              {isForgotPassword ? 'Reset Password' : isSignUp ? 'Create Account' : `Login as ${state}`}
            </button>
          </div>

          <div className='flex flex-col gap-4 text-center text-sm'>
            {!isForgotPassword && (
              <p className='text-gray-600'>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <span
                  onClick={() => setIsSignUp(!isSignUp)}
                  className='ml-1 font-semibold text-primary hover:text-opacity-80 cursor-pointer hover:underline transition-all'
                >
                  {isSignUp ? 'Login here' : 'Sign up here'}
                </span>
              </p>
            )}

            <p>
              <span
                onClick={() => { setIsForgotPassword(!isForgotPassword); setIsSignUp(false); }}
                className='font-medium text-gray-500 hover:text-primary cursor-pointer transition-all'
              >
                {isForgotPassword ? 'Back to Login' : 'Forgot Password?'}
              </span>
            </p>

            <div className='relative flex items-center py-2'>
              <div className='flex-grow border-t border-gray-200'></div>
              <span className='flex-shrink mx-4 text-gray-400 text-xs uppercase'>Switch Role</span>
              <div className='flex-grow border-t border-gray-200'></div>
            </div>

            <p className='mt-2'>
              {state === 'Admin' ? 'Are you a Doctor?' : 'System Administrator?'}
              <span
                onClick={() => { setState(state === 'Admin' ? 'Doctor' : 'Admin'); setIsSignUp(false); setIsForgotPassword(false); }}
                className='ml-1 font-semibold text-primary hover:text-opacity-80 cursor-pointer hover:underline transition-all'
              >
                Click here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
