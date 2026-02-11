import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Login = () => {

  const [state, setState] = useState('Sign Up')
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (isForgotPassword) {
        const { data } = await axios.post(backendUrl + '/api/user/forgot-password', { email, newPassword })
        if (data.success) {
          toast.success(data.message)
          setIsForgotPassword(false)
          setState('Login')
        } else {
          toast.error(data.message)
        }
        return
      }

      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <div className='min-h-[80vh] flex items-center justify-center bg-transparent py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-100'>
        <div className='text-center'>
          <img src={assets.logo} alt="MediCare Logo" className='mx-auto h-16 w-auto mb-6 rounded-lg' />
          <p className='text-3xl font-extrabold text-gray-900 tracking-tight'>
            {isForgotPassword ? 'Reset Password' : state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </p>
          <p className='mt-2 text-sm text-gray-600'>
            {isForgotPassword ? 'Please enter your email to reset password' : state === 'Sign Up' ? 'Join MediCare to book appointments easily' : 'Please log in to your account'}
          </p>
        </div>

        <form className='mt-8 space-y-6' onSubmit={onSubmitHandler}>
          <div className='rounded-md shadow-sm space-y-4'>
            {state === 'Sign Up' && !isForgotPassword && (
              <div>
                <label htmlFor="name" className='block text-sm font-medium text-gray-700'>Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className='appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-200'
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-700'>Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className='appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-200'
                placeholder="name@company.com"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            {isForgotPassword ? (
              <div>
                <label htmlFor="newPassword" className='block text-sm font-medium text-gray-700'>New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  className='appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-200'
                  placeholder="••••••••"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="password" className='block text-sm font-medium text-gray-700'>Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className='appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-200'
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]'
            >
              {isForgotPassword ? 'Reset Password' : state === 'Sign Up' ? 'Create Account' : 'Sign In'}
            </button>
          </div>

          <div className='flex flex-col gap-4 text-center text-sm'>
            {!isForgotPassword && (
              <p className='text-gray-600'>
                {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}
                <span
                  onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
                  className='ml-1 font-medium text-primary hover:text-opacity-80 cursor-pointer underline-offset-4 hover:underline transition-all'
                >
                  {state === 'Sign Up' ? 'Login here' : 'Create one'}
                </span>
              </p>
            )}

            <p>
              <span
                onClick={() => setIsForgotPassword(!isForgotPassword)}
                className='font-medium text-primary hover:text-opacity-80 cursor-pointer transition-all'
              >
                {isForgotPassword ? 'Back to Login' : 'Forgot your password?'}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
