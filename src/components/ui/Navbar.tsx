"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname=usePathname();
    const [activeTab, setActiveTab] = useState(pathname.split('/')[1]);
    const router=useRouter();
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
      setLoading(true)
      axios
        .get("http://localhost:3000/api/v1/auth/check-auth", { withCredentials: true }) 
        .then((res) => {
          if (res.data.authenticated) {
            setUserLoggedIn(true)
          } else {
            setUserLoggedIn(false)
          }
        })
        .catch((error) => {
          console.error("Error checking auth:", error);
        })
        .finally(() => {
          setLoading(false); 
        });
    }, []);
  return (
    <>
          <div className="flex justify-between items-center p-4 bg-transparent shadow-md z-50 relative">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Weave Logo" width={48} height={48} className="w-12 h-12 md:w-16 md:h-16"/>
              <span className="text-xl font-semibold cursor-pointer" onClick={()=>router.push('/')}>Weave</span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex text-md bg-[#F97316] rounded-3xl">
              {["home", "about", "feedback"].map((tab, index) => (
                <div key={tab} className="flex items-center">
                  <button
                    onClick={() =>{
                      setActiveTab(tab);
                      router.push(`/${tab!=="home"?tab:''}`);
                    }}
                    className={`px-6 py-3 w-[140px] text-center transition-all 
                      ${activeTab === `${tab!=="home"?tab:""}`? "bg-[#f1a650] text-black rounded-3xl   " : "hover:bg-[rgb(220,110,40)] rounded-3xl"}
                    `}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                  {index < 2 && <span className="text-black ">|</span>}
                </div>
              ))}
            </div>        
            {/* Authentication Buttons */}
            {userLoggedIn?<div><img src="vector.png" className="size-8" /></div>:<div className="hidden md:flex gap-4 ">
              <button className="px-4 py-2 bg-transparent border border-[#F97316] rounded-md hover:bg-[#F97316] hover:text-black"  onClick={()=>router.push('/signup')}>Sign up</button>
              <button className="px-4 py-2 bg-[#F97316] rounded-md hover:bg-orange-500" onClick={()=>router.push('/login')}>Log in</button>
            </div>}

            
            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
          {isMenuOpen && (
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gray-900 p-6 flex flex-col shadow-lg z-40 md:hidden">
          <button className="self-end" onClick={() => setIsMenuOpen(false)}>
          </button>
          <nav className="flex flex-col gap-4 mt-8">
            {['home', 'about', 'feedback'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-md text-lg ${
                  activeTab === tab ? "bg-[#F97316] text-black" : "hover:bg-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}

export default Navbar
