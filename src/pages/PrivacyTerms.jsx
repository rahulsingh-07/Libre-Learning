import React from "react";
import { motion } from "framer-motion";

const PrivacyTerms = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 py-12 ">
      <motion.div
        className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-2xl"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.h1
          className="text-4xl font-extrabold mb-8 text-center text-blue-700"
          variants={fadeIn}
        >
          Privacy Policy & Terms of Service
        </motion.h1>

        {/* Privacy Policy Section */}
        <motion.section className="mb-12" variants={fadeIn}>
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Privacy Policy</h2>
          <p className="text-gray-700 mb-4">
            <strong>November 25th 2024</strong> 
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Libre-Learning</strong> we is committed
            to protecting your privacy. This section explains how we collect,
            use, and safeguard your information when you use our platform.
          </p>
          <h3 className="text-lg font-medium mb-2 text-gray-800">1. Information We Collect</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Personal Information: Name, email address, and profile picture during registration.</li>
            <li>Uploaded Content: Metadata and file content of uploaded books or research papers.</li>
            <li>Usage Data: IP address, browser type, and usage patterns for analytics.</li>
          </ul>
          <h3 className="text-lg font-medium mb-2 text-gray-800">2. How We Use Your Information</h3>
          <p className="text-gray-700 mb-4">
            We use your data to personalize your experience, improve services, and provide access to platform features.
          </p>
        </motion.section>

        {/* Terms of Service Section */}
        <motion.section variants={fadeIn}>
          <h2 className="text-3xl font-bold mb-4 text-blue-600">Terms of Service</h2>
          <p className="text-gray-700 mb-4">
            <strong>November 25th 2024</strong>
          </p>
          <p className="text-gray-700 mb-4">
            These Terms and Conditions ("Terms") govern your use of the
            <strong> Libre Learning</strong> platform ("Service"). By accessing
            or using our platform, you agree to these Terms.
          </p>
          <h3 className="text-lg font-medium mb-2 text-gray-800">1. Use of the Platform</h3>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>You must be at least 13 years old to use our platform.</li>
            <li>Keep your account credentials secure.</li>
            <li>Do not upload illegal or harmful content.</li>
          </ul>
          <h3 className="text-lg font-medium mb-2 text-gray-800">2. Content Ownership</h3>
          <p className="text-gray-700 mb-4">
            You retain ownership of your uploaded content but grant us a license to store and display it on the platform.
          </p>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default PrivacyTerms;
