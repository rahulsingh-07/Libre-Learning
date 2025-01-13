import React, { useContext, useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import app from '../firebaseConfig'; // Import Firebase configuration
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from './context/AuthContext';
import { ToastContainer,toast } from 'react-toastify';
export default function Login() {

  const [error, setError] = useState("");

  const { dispatch } = useContext(AuthContext);
  const auth = getAuth(app); // Firebase Auth instance
  const googleProvider = new GoogleAuthProvider(); // Google Auth Provider
  const githubProvider = new GithubAuthProvider();
  const navigate = useNavigate();

  // Check if the user is admin
  const handleUserRedirect = (user) => {
    if (user.uid === "iimFL8tSBAbiYsilxQ1kydgI19i2") {
      // If user ID is "secret", navigate to admin panel
      navigate("/admin");
    } else {
      // Otherwise, navigate to the user panel
      navigate("/user");
    }
  };

  // Handle GitHub Sign-In
  const handleGithubSignIn = (e) => {
    signInWithPopup(auth, githubProvider)
      .then((result) => {
        const user = result.user;
        dispatch({ type: "LOGIN", payload: user });
        handleUserRedirect(user); // Redirect user based on role
        setError(""); // Clear error message on success
      })
      .catch((error) => {
        setError(`Please signup first`);
        toast.error("Error signing in with GitHub:", error);
      });
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        dispatch({ type: "LOGIN", payload: user });
        handleUserRedirect(user); // Redirect user based on role
        setError(""); // Clear error message on success
      })
      .catch((error) => {
        setError(`Please signup first`);
        toast.error("Error signing in with Google:", error);
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
      <div className="h-auto w-full max-w-[1000px] bg-opacity-20 backdrop-blur-lg rounded-lg mx-4 md:mx-8 lg:mx-16 my-4 md:my-8 lg:my-16 grid grid-cols-1 md:grid-cols-2 justify-center px-4 py-3 gap-5 items-center shadow-black shadow-2xl ">
        
        {/* Login Form */}
        <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-lg ">
          {/* GitHub Sign-In Button */}
          <motion.button
            onClick={handleGithubSignIn}
            whileHover={{ scale: 1.2 }}
            className="flex justify-center items-center m-auto mt-6 h-[45px] rounded-md p-3 border-2 bg-white"
          >
            <img
              className="w-[25px] mr-2"
              src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
              alt="GitHub"
            />
            Login with GitHub
          </motion.button>
          
          {/* Google Sign-In Button */}
          <motion.button
            onClick={handleGoogleSignIn}
            whileHover={{ scale: 1.2 }}
            className="flex justify-center items-center m-auto mt-6 h-[45px] rounded-md p-3 border-2 bg-white"
          >
            <img
              className="w-[25px] mr-2"
              src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
              alt="Google"
            />
            Login with Google
          </motion.button>
        </div>

        {/* Signup Button */}
        <div className="flex flex-col justify-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Don't have an account?</h2>
            <p className="text-gray-700 mb-6 text-center">Signup and explore the world of knowledge.</p>
          </div>
          <NavLink to='/signup'>
            <button
              type="submit"
              className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
            >
              Sign up
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
