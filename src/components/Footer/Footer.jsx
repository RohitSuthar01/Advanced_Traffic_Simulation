import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'; // (Note: To use this, you must install react-icons: npm install react-icons)

const Footer = () => {
 const currentYear = new Date().getFullYear();
 return (
 <footer className="bg-[linear-gradient(90deg,rgba(2,0,36,1)_0%,rgba(208,214,36,1)_0%,rgba(250,0,17,1)_0%,rgba(219,40,19,1)_9%,rgba(203,20,182,1)_51%,rgba(78,154,24,1)_100%,rgba(181,184,37,1)_100%,rgba(59,121,9,1)_51%,rgba(87,138,8,1)_51%,rgba(206,212,2,1)_88%,rgba(237,231,1,1)_95%,rgba(255,242,0,1)_100%,rgba(62,69,21,1)_100%,rgba(0,212,255,1)_96%)] text-white p-6 mt-10 w-full">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        <div className="text-sm text-black">
          &copy; {currentYear} Traffic Sim. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm mr-2 hidden sm:inline">Follow us on:</span> 

          <a 
            href="https://www.facebook.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="Facebook"
          ><FaFacebook size={20} /> 
          </a><a 
            href="https://www.twitter.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="Twitter"
          ><FaTwitter size={20} />
          </a>
          <a 
            href="https://www.instagram.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-400 hover:text-white transition duration-300"
            aria-label="Instagram"
          > <FaInstagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
// "overrides": {
  //   "vite": "npm:rolldown-vite@7.1.14"
  // }