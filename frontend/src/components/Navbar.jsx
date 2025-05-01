import { FaRegEnvelope } from "react-icons/fa"; // Importing the envelope icon
import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);
  const [showProvidersDropdown, setShowProvidersDropdown] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(false);
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
      <img onClick={() => navigate('/')} className="w-44 cursor-pointer" src={assets.logo} alt="" />
      
      <ul className="md:flex items-start gap-5 font-medium hidden">
        <NavLink to="/">
          <li className="py-1">HOME</li>
        </NavLink>

        {/* Providers Dropdown */}
        <li
          className="py-1 relative cursor-pointer flex items-center gap-2"
          onClick={() => setShowProvidersDropdown(!showProvidersDropdown)}
          aria-expanded={showProvidersDropdown}
        >
          OUR PROVIDERS
          <img
            className={`w-2 transform transition-transform ${
              showProvidersDropdown ? 'rotate-180' : 'rotate-0'
            }`}
            src={assets.dropdown_icon}
            alt="Dropdown Arrow"
          />
          <div
            className={`absolute top-full left-0 bg-white shadow-md rounded-md mt-1 z-10 transition-all ${
              showProvidersDropdown ? 'block' : 'hidden'
            }`}
          >
            <p
              onClick={() => navigate('/doctors')}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Doctors
            </p>
            <p
              onClick={() => navigate('/pharmacists')}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Pharmacists
            </p>
          </div>
        </li>

        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {token && userData ? (
          <div className="flex items-center gap-4 cursor-pointer relative">
            {/* Envelope Icon (React-Icons) */}
            <FaRegEnvelope
              className="text-gray-600 text-2xl cursor-pointer hover:text-gray-800"
              onClick={() => navigate('/messages')}
            />

            {/* Profile Dropdown */}
            <div className="flex items-center gap-2 group">
              <img className="w-8 rounded-full" src={userData.image} alt="" />
              <img className="w-2.5" src={assets.dropdown_icon} alt="" />
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
                <div className="min-w-48 bg-gray-50 rounded flex flex-col gap-4 p-4">
                  <p
                    onClick={() => navigate('/my-profile')}
                    className="hover:text-black cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate('/my-appointments')}
                    className="hover:text-black cursor-pointer"
                  >
                    My Appointments
                  </p>
                  <p onClick={logout} className="hover:text-black cursor-pointer">
                    Logout
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create account
          </button>
        )}

        {/* Mobile Menu Icon */}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt=""
        />

        {/* ---- Mobile Menu ---- */}
        <div
          className={`md:hidden ${
            showMenu ? 'fixed w-full' : 'h-0 w-0'
          } right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} className="w-36" alt="" />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              className="w-7"
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded full inline-block">HOME</p>
            </NavLink>
            <li
              className="px-4 py-2 rounded full inline-block cursor-pointer"
              onClick={() => setShowMenu(false)}
            >
              <p
                onClick={() => navigate('/doctors')}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Doctors
              </p>
              <p
                onClick={() => navigate('/pharmacists')}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                Pharmacists
              </p>
            </li>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded full inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded full inline-block">CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;