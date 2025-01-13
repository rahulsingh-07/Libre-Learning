import React from 'react';
import { useNavigate } from 'react-router-dom';
import civilimg from '../assets/Civil engg.jpg'
import ece from '../assets/ece.jpg'
import eee from '../assets/eee.jpg'
import cse from '../assets/cse.jpg'
import mac from '../assets/mac.jpg'
import other from '../assets/other.jpg'
const BookStore = () => {
  const navigate = useNavigate();

  // Define the branches you want to show
  const branches = [
    { name: "Computer Science",type:"CSE", image:cse },
    { name: "Mechanical Engineering",type:"MAC", image:  mac},
    { name: "Civil Engineering",type:"CIVIL", image: civilimg },
    { name: "Electrical Engineering",type:"EEE", image: eee },
    { name: "Electronics and Communication Engineering ",type:"ECE", image:ece  },
    { name: "Literature",type:"Literature", image: "https://i.pinimg.com/736x/b0/52/6d/b0526d8ca7d5b6202bc0b22481258421.jpg" },
    { name: "Other books",type:"Other", image:other},
  ];

  // Function to handle branch card click
  const handleCardClick = (branchName) => {
    scrollToTop();
    navigate(`/books/${encodeURIComponent(branchName)}`); // Navigate to the BookDetails component with branch name
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-6 px-12'>
      {branches.map((branch, index) => (
        <div
          key={index}
          className="shadow-2xl relative border border-gray-300 p-4 w-full overflow-hidden rounded-lg transition transform hover:scale-105 cursor-pointer"
          onClick={() => handleCardClick(branch.type)} // Navigate to the branch's books on click
        >
          <h2 className='font-bold text-lg mb-2'>{branch.name}</h2>
          
          <img src={branch.image} alt={branch.type} className="rounded-lg shadow-md object-cover max-w-full h-auto  mb-4" />
        </div>
      ))}
    </div>
  );
};

export default BookStore;
























