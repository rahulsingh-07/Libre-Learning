import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { SlSocialInstagram ,SlSocialFacebook, SlSocialLinkedin  } from "react-icons/sl";
import { AuthContext } from '../pages/context/AuthContext';

export default function Footer() {
  const { currentUser } = useContext(AuthContext);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div>
      {/* Footer */}
  <footer className=" bg-[#f4f5d7] h-screen relative">
  <h1 className='md:text-8xl text-6xl font-bold p-6'>LIBRE LEARNING</h1>
    <div className=' grid grid-cols-2  p-6 gap-5'>
    <div>
    
     <div >
      <h1 className='text-4xl font-serif py-4'>SOCIAL MEDIA</h1>
      {/* social links */}
      <ul className='sm:text-3xl text-xl font-thin -6 space-y-6 '>
        
        <li className='hover:text-blue-500 max-w-fit'><a  href="https:/www.facebook.com"><SlSocialFacebook />facebook</a></li>
        <li className='hover:text-blue-500 max-w-fit'> <a href="https://www.instagram.com/"><SlSocialInstagram />Instagram</a></li>
        <li className='hover:text-blue-500 max-w-fit'> <a href="https://www.linkedin.com/in/rahul-singh-rana-61035726b?lipi=urn%3Ali%3Apage%3Ad_flagship3_feed%3B2EQmCtn7R9ye2N2IZxKpLQ%3D%3D"><SlSocialLinkedin />Linkdin</a></li>

      </ul>
     </div>
    </div>
    <div className='flex '>
      <ul className='sm:text-3xl text-xl font-thin flex flex-col sm:gap-5 gap-2  '>
      <li onClick={scrollToTop} className="relative  w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
        <NavLink to="/">Home</NavLink></li>
  <li onClick={scrollToTop} className="relative  w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
    <NavLink to="/books">Book Store</NavLink></li>
  <li onClick={scrollToTop} className="relative  w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
    <NavLink to="/research-papers">Research Papers</NavLink></li>
  <li onClick={scrollToTop} className="relative  w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
    <NavLink to="/about">About Us</NavLink></li>
  <li onClick={scrollToTop} className="relative  w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
    <NavLink to="/contact">Contact</NavLink></li>
  {currentUser?<li onClick={scrollToTop} className="relative  w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
    <NavLink to="/user">User</NavLink></li>
   :<li onClick={scrollToTop} className="relative  w-fit block after:block after:content-[''] after:absolute after:h-[2px] after:bg-black after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left">
    <NavLink to="/login">Contribute</NavLink></li>}
  
      </ul>
    </div>
    </div>

   

    <div className='absolute bottom-4  flex flex-col items-center justify-center  text-xl p-6 w-full'>
      <div className='h-[1px] bg-black w-full'></div>
     <p className='flex flex-col justify-center'>&copy; 2024 LibreLearn. All rights reserved.</p>
    <div className="sm:mt-4 ">
      <li className=" list-none mx-2 hover:text-blue-500"><NavLink onClick={scrollToTop} to="/privacy-terms">Privacy Policy & Terms of Service</NavLink></li>
     
    </div>
    </div>
    
  </footer>
    </div>
  )
}
