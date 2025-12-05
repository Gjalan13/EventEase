// import React from 'react'
import { FaCopyright } from "react-icons/fa";

export default function  Footer() {
  return (
    <div className="w-full bg-primary-900 text-white py-4 flex flex-col items-center">
  
  {/* Top Row */}
  <div className="flex items-center gap-2">
    <FaCopyright className="h-4 w-4" />
    <span className="text-sm tracking-wide">Event Ease</span>
  </div>

  {/* Bottom Row */}
  <div className="text-xs mt-1 opacity-80">
    Created by <span className="font-semibold">Gunjan Jalan</span>, 
    <span className="font-semibold"> Ashika</span>, and 
    <span className="font-semibold"> Shrey Sojitra</span>
  </div>

</div>

  )
}
