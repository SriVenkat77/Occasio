import { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// Connect to backend socket
const socket = io('https://ocasio.onrender.com');

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useContext(UserContext);

  // Fetch remembered credentials
  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPass = localStorage.getItem('rememberedpass');
    if (storedEmail) {
      setEmail(storedEmail);
      setPassword(storedPass);
    }
  }, []);

  // Listen for socket notifications
  useEffect(() => {
    socket.on('notify', (data) => {
      toast.success(data.message);
    });

    return () => {
      socket.off('notify');
    };
  }, []);

  async function loginUser(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post('https://twooccasio.onrender.com/login', { email, password });
      setUser(data.user);
      toast.success('Login successful');
      
      // Emit socket event for login success
      socket.emit('loginSuccess', { email });

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedpass', password);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      setRedirect(true);
    } catch (e) {
      toast.error('Login failed');
    }
  }

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-screen bg-gradient-to-b from-primarydark to-primarylight flex justify-center items-center">
      <div className="bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl relative">
        <form className="flex flex-col items-center" onSubmit={loginUser}>
          <h1 className="px-3 font-extrabold mb-5 text-primarydark text-2xl">Sign In</h1>
          
          <div className="input mb-4 w-full">
            <input
              type="email"
              placeholder="Email"
              className="input-et w-full"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>

          <div className="input mb-4 w-full relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="input-et w-full pr-10"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>

          <div className="mb-5 w-full">
            <div className="flex justify-between items-center">
              <label>
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <Link to="/forgotpassword" className="text-primarydark text-sm">Forgot password?</Link>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-2 text-white border-2 border-black bg-primarydark rounded-lg shadow-md transition-all duration-300 hover:bg-black hover:text-white hover:scale-105">
            Sign In
          </button>
          <Link to="/register" className="text-primarydark text-sm">New User ? Register NOW !</Link>
        </form>
      </div>
    </div>
  );
}
