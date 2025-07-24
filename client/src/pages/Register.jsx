import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_BASE;

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/auth/register`, form);
      setMessage('User registered. Please login.');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    // <div>
    //   <h2>Register</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input name="name" placeholder="Name" onChange={handleChange} /><br />
    //     <input name="email" placeholder="Email" onChange={handleChange} /><br />
    //     <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
    //     <button type="submit">Register</button>
    //   </form>
    //   {message && <p>{message}</p>}
    // </div>

    <>
      <div className='grid grid-template-columns: repeat(6, 1fr) grid-template-rows: repeat(5, 1fr) gap-[8px] max-w-7xl mx-auto px-4 p-4'>
        <div className='grid-column: span 2 / span 2'>TaskForge</div>
      </div>


      <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 py-4 px-6">
            <h1 className="text-2xl font-bold text-white">Create Account</h1>
            <p className="text-blue-100">Join us today!</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" id="name" name="name" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" placeholder="John Doe"/>
            </div>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="your@email.com"
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition font-medium cursor-pointer"
            >
              Register
            </button>
          </form>

          <Link to={'/login'}>{message && <p>{message}</p>}</Link>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to={'/login'} className="text-blue-600 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>

    </>

  );
}

export default Register;
