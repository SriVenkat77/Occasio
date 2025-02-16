import React, { useState } from 'react';
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  async function handleForgotPassword(ev) {
    ev.preventDefault();
    
    alert('Password reset link sent to your email!');
  }

  return (
    <div className="h-screen bg-gradient-to-b from-primarydark to-primarylight flex justify-center items-center">
      <div className="bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl">
        <form className="flex flex-col items-center" onSubmit={handleForgotPassword}>
          <h1 className="px-3 font-extrabold mb-5 text-primarydark text-2xl">Forgot Password</h1>

          <div className="input mb-4 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 100 11.668.75.75 0 011.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0121.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 11-.82-6.26V8.25a.75.75 0 011.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 00-2.416-5.834zM15.75 12a3.75 3.75 0 10-7.5 0 3.75 3.75 0 007.5 0z" clipRule="evenodd" />
            </svg>
            <input
              type="email"
              placeholder="Email"
              className="input-et w-full"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>

          <div className="w-full py-4">
            <button
              type="submit"
              className="btn-primary w-full py-2 text-white border-2 border-black bg-primarydark rounded-lg shadow-md transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primarydark"
            >
              Submit
            </button>
          </div>

          <div className="absolute bottom-3 left-0 right-0 text-center text-sm">
            <p>
              Remember your password? <Link to="/login" className="text-primarydark font-bold">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
