import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WestIcon from '@mui/icons-material/West';
import axios from 'axios';
import "../App.css"
function LoginPage({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, password }, { withCredentials: true });
      setUser(response.data.user); 
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <div>
        {/* вспышка */}
        <div className="bg-[#8A3CFA] opacity-25 w-[500px] h-[400px] rounded-tr-full fixed bottom-0"></div>
        {/* див с инфой */}
        <div className="backdrop-blur-[100px] w-full h-screen fixed ">
          <Link to="/" className="w-[100px] h-[50px] border-2 border-gray-400 rounded-lg flex items-center justify-center text-center fixed top-5 left-5 button-violet-hover"> <WestIcon fontSize="small"/> <p className="block w-[5px]"></p>Back</Link>
          {error && <p>{error}</p>}
          <form onSubmit={handleLogin} className="w-[700px] h-[700px] mx-auto mt-32 p-10 flex items-center flex-col justify-around">
            <div className='flex flex-col items-center space-y-5'>
              <h1 className="text-7xl text-center font-bold ">Login</h1>  
              <p>Welcome back!</p>
            </div>
            <div className=" flex flex-col space-y-4 w-[90%] p-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="w-full mx-auto h-[60px] border-2 rounded-lg bg-black p-2"
                
                />
            
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full mx-auto h-[60px] border-2 rounded-lg bg-black p-2"
              />
            </div>
            <div className="flex items-center flex-col  space-y-3 w-[90%] p-4">
              <button type="submit" className="w-full bg-[#8A3CFA] h-[70px] font-bold text-3xl rounded-lg hover:bg-[#AB70FD] hover:scale-105 transition duration-300  ">Login</button> 
              <Link to="/register" className="text-glow-hover underline">Create an account</Link>
            </div>
          </form>
        </div>
        {/* вспышка */}
        <div className="bg-[#8A3CFA] opacity-30 w-[500px] h-[400px] rounded-bl-full fixed top-0 right-0 -z-10"></div>
      </div>
    
    </>
  );
}

export default LoginPage;
