import React from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#aff8e0] flex flex-col justify-center items-center">
      {/* Page Container */}
      <div className="max-w-6xl w-full px-6 py-12 lg:py-24 space-y-12" ref={sectionRef}>
        {/* Hero Section */}
        <div className="text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            About LibreLearn
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-gray-600"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            LibreLearn is a comprehensive platform dedicated to providing free access to a wealth of educational resources.
            Our mission is to democratize knowledge and support lifelong learning for everyone, everywhere.
          </motion.p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            className="bg-[#004D43] p-8 rounded-lg shadow-lg text-[#CDEA68]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            whileHover={{scale:1.2}}
          >
            <h2 className="text-2xl md:text-3xl font-bold  mb-4">Our Mission</h2>
            <p className="">
              Our mission is to make quality education accessible to all by providing a vast collection of books, research papers,
              and learning materials for free. We believe in empowering individuals through knowledge and fostering a culture of
              continuous learning and growth.
            </p>
          </motion.div>
          <motion.div
            className="bg-[#004D43] p-8 rounded-lg shadow-lg text-[#CDEA68]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            whileHover={{scale:1.2}}
          >
            <h2 className="text-2xl md:text-3xl font-bold  mb-4">Our Vision</h2>
            <p className="">
              We envision a world where knowledge is universally accessible and can be leveraged to drive positive change. Our goal is
              to build a global community of learners who are equipped with the resources they need to succeed and make meaningful
              contributions to society.
            </p>
          </motion.div>
        </div>

        {/* Meet the Team Section */}
        <div className="text-center">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Meet the Team
          </motion.h2>
          <p className="text-lg text-gray-600 mb-12">
            Our team is composed of dedicated professionals passionate about education and technology. We work tirelessly to
            ensure that LibreLearn remains a valuable resource for learners around the world.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-60 text-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{scale:1.2}}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Rahul Singh Rana & Vijay Kumar</h3>
              <p className="text-gray-600">Founder & Lead Developer</p>
            </motion.div>
            {/* Add more team members as needed */}
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Get in Touch
          </motion.h2>
          <p className="text-lg text-gray-600 mb-4">
            Have questions or want to collaborate? Reach out to us at:
          </p>
          <a href="mailto:contact@librelearn.com" className="text-blue-600 hover:underline">
            rahulsinghrana291@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
