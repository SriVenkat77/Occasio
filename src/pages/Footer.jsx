import React from 'react';
import { FaCopyright } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="w-full bg-black">
      
      <div className="bg-gray-800 py-3 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Occasio. All rights reserved.</p>
      </div>
    </div>
  );
}
