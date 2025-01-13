import React , { useContext }from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../pages/context/AuthContext';


export default function Togglebtn() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { id: 1, title: 'Home', link: '/' },
    { id: 2, title: 'Book Store', link: '/books' },
    { id: 3, title: 'Research Papers', link: '/research-papers' },
    { id: 4, title: 'About Us', link: '/about' },
    { id: 5, title: 'Contact', link: '/contact' },
    currentUser
    ? { id: 6, title: 'User', link: '/user' }
    : { id: 6, title: 'Contribute', link: '/login' }, // Conditional item
  ];

  return (
    <div>
      <div
        onChange={toggleSidebar}
        className="fixed bg-black overflow-hidden w-12 h-12 rounded-full top-4 right-2 m-2 flex justify-center items-center z-50 cursor-pointer"
      >
        <label className="flex flex-col gap-2 w-full p-2 cursor-pointer">
          <input
            className="peer hidden"
            type="checkbox"
            checked={isSidebarOpen}
            readOnly
          />
          <div className="rounded-2xl h-[3px] w-1/2 bg-white duration-500 peer-checked:rotate-[225deg] origin-right peer-checked:-translate-x-[12px] peer-checked:-translate-y-[1px]"></div>
          <div className="rounded-2xl h-[3px] w-full bg-white duration-500 peer-checked:-rotate-45"></div>
          <div className="rounded-2xl h-[3px] w-1/2 bg-white duration-500 place-self-end peer-checked:rotate-[225deg] origin-left peer-checked:translate-x-[12px] peer-checked:translate-y-[1px]"></div>
        </label>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed w-[100vw] h-[100vh] z-40 backdrop-blur-sm flex items-center justify-end pt-2 transition-all duration-500 ${
          isSidebarOpen ? 'right-0' : 'right-[-100vw]'
        }`}
      >
        <div className="h-[90%]  md:w-[90%] sm:w-[80%] w-[70%]  mt-16 bg-black rounded-l-3xl p-10 pr-0 flex items-center">
          <ul
            onClick={toggleSidebar}
            className="space-y-4 w-full text-center sm:text-left"
          >
            {menuItems.map((item) => (
              <motion.li
                key={item.id}
                whileHover={{ color: 'blue' }}
                onClick={scrollToTop}
                className="text-white font-serif text-3xl sm:text-6xl md:text-7xl border-b"
              >
                <NavLink to={item.link}>
                  <div>{item.title}</div>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
