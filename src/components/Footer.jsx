import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 flex items-center text-white h-[100px] w-full  bottom-0">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Menu Advisor. </p>
          <p>&copy; All rights reserved. </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;