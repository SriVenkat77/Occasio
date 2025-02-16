import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleResetPassword(ev) {
    ev.preventDefault();
    // Add password reset logic here
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password reset successfully!");
  }

  return (
    <div className="flex w-full h-screen px-10 py-10 justify-center items-center bg-gradient-to-b from-primarydark to-primarylight">
      <div className="bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl shadow-lg">
        <form
          className="flex flex-col w-full items-center"
          onSubmit={handleResetPassword}
        >
          <h1 className="font-extrabold mb-5 text-primarydark text-2xl">
            Reset Password
          </h1>

          <div className="input mb-4 w-full">
            <input
              type="password"
              placeholder="New Password"
              className="input-et w-full"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </div>

          <div className="input mb-4 w-full">
            <input
              type="password"
              placeholder="Confirm Password"
              className="input-et w-full"
              value={confirmPassword}
              onChange={(ev) => setConfirmPassword(ev.target.value)}
            />
          </div>

          <div className="w-full py-4">
            <button
              type="submit"
              className="btn-primary w-full py-2 text-white border-2 border-black bg-primarydark rounded-lg shadow-md transition-all duration-300 hover:bg-black hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primarydark"
            >
              Submit
            </button>
          </div>

          <Link
            to="/login"
            className="flex items-center gap-2 text-primarydark mt-4 px-4 py-2 rounded-md hover:bg-primarylight hover:text-black transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
                clipRule="evenodd"
              />
            </svg>
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}
