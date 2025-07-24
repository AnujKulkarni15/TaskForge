import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API = import.meta.env.VITE_API_BASE;

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/auth/login`, form);
      const { token } = res.data;

      localStorage.setItem('token', token);
      navigate('/dashboard'); // ✅ Redirect to dashboard
    } catch (err) {
      toast.error('Enter correct login credentials!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  };

  return (
    <>
      <div className='grid grid-template-columns: repeat(6, 1fr) grid-template-rows: repeat(5, 1fr) gap-[8px] max-w-7xl mx-auto px-4 p-4'>
        <div className='grid-column: span 2 / span 2'>TaskForge</div>
      </div>

      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 py-4 px-6">
              <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
              <p className="text-blue-100">Sign in to your account</p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition font-medium cursor-pointer"
              >
                Sign In
              </button>
            </form>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to={'/register'} className="text-blue-600 font-medium hover:underline">Sign up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Toast container */}
      <ToastContainer />
    </>
  );
}

export default Login;
