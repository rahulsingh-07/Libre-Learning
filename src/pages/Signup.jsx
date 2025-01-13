import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import app from '../firebaseConfig'; // Import Firebase configuration
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer,toast } from 'react-toastify';

export default function Signup() {

  const [googleError, setGoogleError] = useState("");
  const [GithubError, setGithubError] = useState("");

  const auth = getAuth(app); // Firebase Auth instance
  const googleProvider = new GoogleAuthProvider(); // Google Auth Provider
  const githubProvider = new GithubAuthProvider();

  const handleGithubSignup = (e) => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        // GitHub sign-up successful
        const user = result.user;
        toast.log("GitHub user signed up:");
        setGithubError(""); // Clear any previous errors
        // Additional logic such as saving user data in the database can be done here
      })
      .catch((error) => {
        setGithubError("Failed to sign up with GitHub. Please try again.");
        console.error("Error signing up with GitHub:", error);
      });
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // Google sign-up successful
        const user = result.user;
        toast.log("Google user signed up:");
        setGoogleError(""); // Clear any previous errors
        // Additional logic such as saving user data in the database can be done here
      })
      .catch((error) => {
        setGoogleError("Failed to sign up with Google. Please try again.");
        console.error("Error signing up with Google:", error);
      });
  };

  return (
    <div className="flex justify-center items-center bg-gray-300 min-h-screen bg-gradient-to-r from-[#89eedb] via-[#1de7bb] to-[#27f97e]">
       <div className="max-w-4xl mx-auto p-8 absolute top-2  ">
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      <div className="w-full max-w-[1000px] bg-opacity-20 backdrop-blur-lg mx-4 md:mx-8 lg:mx-16 my-4 md:my-8 lg:my-16 grid grid-cols-1 md:grid-cols-2 justify-center px-4 py-3 gap-5 items-center shadow-black shadow-2xl rounded-lg">

        {/* Signup Form */}
        <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg">

          {/*GitHub Sign-In Button */}
          <motion.button
            onClick={handleGithubSignup}
            whileHover={{ scale: 1.2 }}
            className="flex justify-center items-center m-auto mt-6 h-[45px] rounded-md p-3 border-2 bg-white"
          >
            <img className="w-[25px] mr-2"
              src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
              alt="GitHub"
            />
            Sign Up with GitHub
          </motion.button>
          {/* Google Sign-In Button */}
          <motion.button
            onClick={handleGoogleSignUp}
            whileHover={{ scale: 1.2 }}
            className="flex justify-center items-center m-auto mt-6 h-[45px] rounded-md p-3 border-2 bg-white"
          >
            <img className="w-[25px] mr-2"
              src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
              alt="Google"
            />
            Sign Up with Google
          </motion.button>
          {googleError && <span className="text-red-500 mt-2">{googleError}</span>}
          {GithubError && <span className="text-red-500 mt-2">{GithubError}</span>}
        </div>

        {/* Login Button */}
        <div className="flex flex-col justify-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Already have an account?</h2>
            <p className="text-gray-700 mb-6 text-center">Login and explore the world of knowledge.</p>
          </div>
          <NavLink to='/login'>
            <button
              type="submit"
              className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
            >
              Login
              <svg
                className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                viewBox="0 0 16 19"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                  className="fill-gray-800 group-hover:fill-gray-800"
                ></path>
              </svg>
            </button>
          </NavLink>
        </div>

      </div>
    </div>
  );
}
