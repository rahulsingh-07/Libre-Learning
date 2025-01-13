import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Home() {
  
  return (
    <div>
      <div className="bg-gray-100">
  {/* Hero Section */}
  <section className="text-center p-16 bg-amber-800 text-white">
    <h1 className="text-4xl font-bold">Unlock Knowledge, Open to All</h1>
    
    <div className="mt-8">
    <NavLink to="/books"><button className="bg-white text-black py-3 px-6 rounded-lg mx-2 my-2">Explore Books</button></NavLink>
    <NavLink to="/research-papers"><button className="bg-white text-black py-3 px-6 rounded-lg mx-2 my-2">Explore Research Papers</button></NavLink>
      
    </div>
  </section>

  {/* Features Section */}
  <section className="py-16 ">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold">Why LibreLearn?</h2>
      <p className="mt-4 text-gray-600">Access an endless supply of knowledge, completely free.</p>
    </div>
    <div className="flex justify-around">
      <div className="max-w-xs text-center">
        <h3 className="text-xl font-semibold">Vast Library</h3>
        <p className="mt-2 text-gray-500">Explore a wide range of books and research papers.</p>
      </div>
      <div className="max-w-xs text-center">
        <h3 className="text-xl font-semibold">Open Access</h3>
        <p className="mt-2 text-gray-500">Access all content for free, no paywalls.</p>
      </div>
      <div className="max-w-xs text-center">
        <h3 className="text-xl font-semibold">Contribute</h3>
        <p className="mt-2 text-gray-500">Share your own research and knowledge with the community.</p>
      </div>
    </div>
  </section>

  {/* Featured Books/Research Papers */}
  <section className="py-16 bg-gray-100">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold">Featured Books & Research Papers</h2>
    </div>
   
  </section>

  
  
</div>

    </div>
  )
}
