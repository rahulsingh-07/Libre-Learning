import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { AuthContext } from '../pages/context/AuthContext';

export default function Navbar() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <header className="flex justify-between items-center p-1 bg-[#F2F0E4] shadow-md">
        <div className="font-bold cursor-pointer w-[400px] h-[80px] overflow-hidden flex items-center justify-center">
          <NavLink to="/admin">
            <img className="w-[400px]" src={logo} alt="Logo" />
          </NavLink>
        </div>

        <div>
          <nav className="space-x-6 list-none hidden lg:flex">
            <li className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
              <NavLink to="/books">Books Store</NavLink>
            </li>
            <li className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
              <NavLink to="/research-papers">Research Papers</NavLink>
            </li>
            <li className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
              <NavLink to="/about">About Us</NavLink>
            </li>
            <li className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
              <NavLink to="/contact">Contact</NavLink>
            </li>

            {/* Render User or Contribute based on currentUser */}
            {currentUser ? (
              <li className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
                <NavLink to="/user">User</NavLink>
              </li>
            ) : (
              <li className="relative w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-center">
                <NavLink to="/login">Contribute</NavLink>
              </li>
            )}
          </nav>
        </div>
        <div className="xlg:w-[400px] w-[100px] bg-red-500"></div>
      </header>
    </div>
  );
}
