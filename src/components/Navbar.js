import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.jpeg';
import { FiMenu } from 'react-icons/fi';
import { ImDownload } from 'react-icons/im';
import { BiWorld } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showContactTooltip, setShowContactTooltip] = useState(false);
  const [showUserOptions, setShowUserOptions] = useState(false);

  useEffect(() => {
    const fetchGeolocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation(`Lat: ${latitude}, Long: ${longitude}`);
          },
          (error) => {
            console.error('Error getting location:', error.message);
            setCurrentLocation('Error fetching location');
          }
        );
      } else {
        setCurrentLocation('Geolocation is not supported by this browser.');
      }
    };

    fetchGeolocation();
  }, []);

  const handleUserTypeSelection = (userType) => {
    if (userType === 'Publisher') {
      navigate('/PublisherPage');
    } else if (userType === 'Developer') {
      navigate('/DeveloperPage');
    } else if (userType === 'User') {
      navigate('/UserPage');
    }

    // Close the options after selection
    setShowUserOptions(false);
  };

  return (
    <div className="bg-[#171a21]">
      <div className="flex items-center max-w-[70vw] mx-auto relative">
        {/* Left Section */}
        <div className="flex items-center justify-center lg:justify-start py-2 px-2 lg:py-6 lg:px-8 w-full lg:w-auto">
          <div className="lg:hidden left-4 absolute text-white">
            <FiMenu className="text-[30px]" />
          </div>

          <div className="flex items-center text-[#c5c3c0] font-semibold text-[26px]">
            <img src={logo} className="w-12 h-12 mr-2" alt="Logo" />
            <p>ChakDeGames</p>
          </div>
        </div>

        {/* Middle Section */}
        <div className="hidden lg:flex pl-10">
          <ul className="text-[#c5c3c0] text-[13px] flex gap-5">
            <li
              onMouseEnter={() => setShowContactTooltip(true)}
              onMouseLeave={() => setShowContactTooltip(false)}
            >
              <p className="cursor-pointer">SUPPORT</p>
              {showContactTooltip && (
                <div className="absolute bg-gray-800 text-white p-4 rounded shadow">
                  <p className="font-bold text">Need support or have questions?</p>
                  <p className="text-sm">Contact us at:</p>
                  <a
                    href="mailto:puneetsheokand123@gmail.com"
                    className="underline text-blue-400 hover:text-blue-300"
                  >
                    puneetsheokand123@gmail.com
                  </a>
                </div>
              )}
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="absolute right-10 top-0 text-[12px] lg:flex items-center mt-2 hidden">
          <a
            href="https://store.steampowered.com/about/?snr=1_14_4__global-header"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-[#5c7e10] px-2 py-1 rounded-[0.3rem] cursor-pointer"
          >
            <ImDownload className="mr-2" />
            <p className=" ">Download App</p>
          </a>

          <div
            className="ml-4 bg-white hover:bg-inherit px-2 py-[2px] rounded-[0.5rem] group duration-100 ease-out cursor-pointer"
            onClick={() => setShowUserOptions(!showUserOptions)}
          >
            <p className="text-[#5c7e10] font-semibold group-hover:text-white duration-100 ease-out">
              Sign In
            </p>
            {showUserOptions && (
              <div className="absolute mt-2 flex flex-col space-y-2">
                <div
                  className="bg-[#5c7e10] px-4 py-2 rounded-[0.3rem] cursor-pointer"
                  onClick={() => handleUserTypeSelection('User')}
                >
                  User
                </div>
                <div
                  className="bg-[#5c7e10] px-4 py-2 rounded-[0.3rem] cursor-pointer"
                  onClick={() => handleUserTypeSelection('Publisher')}
                >
                  Publisher
                </div>
                <div
                  className="bg-[#5c7e10] px-4 py-2 rounded-[0.3rem] cursor-pointer"
                  onClick={() => handleUserTypeSelection('Developer')}
                >
                  Developer
                </div>
              </div>
            )}
          </div>

          <div className="h-[15px] w-[1px] bg-white mx-2"></div>

          <div className="flex items-center">
            <BiWorld className="w-5 h-5 mr-1" />
            <p style={{ color: 'white' }}>{currentLocation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
