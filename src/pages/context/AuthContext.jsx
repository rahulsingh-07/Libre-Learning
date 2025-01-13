import React, { createContext, useEffect, useReducer, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import AuthReducer from "./AuthReducer";

// Session timeout duration (7 days in milliseconds)
const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000;

// Firebase Authentication setup
const auth = getAuth();

// Helper function to get user and validate session from localStorage
const getValidUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const sessionExpiry = parseInt(localStorage.getItem("sessionExpiry"), 10);

    if (user && sessionExpiry && Date.now() < sessionExpiry) {
      return user; // Return valid user if session is not expired
    }
    // Remove invalid session
    localStorage.removeItem("user");
    localStorage.removeItem("sessionExpiry");
    return null;
  } catch (error) {
    console.error("Error reading session data:", error);
    return null;
  }
};

// Initial state of the authentication context
const INITIAL_STATE = {
  currentUser: getValidUser(), // Load initial user state
};

// Create the AuthContext
export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [loading, setLoading] = useState(true);

  // Validate user session on mount
  useEffect(() => {
    const validateSession = () => {
      const user = getValidUser();
      if (user) {
        dispatch({ type: "LOGIN", payload: user });
      } else {
        dispatch({ type: "LOGOUT" });
      }
      setLoading(false); // Mark loading as false after validation
    };
    validateSession();
  }, []);

  // Sync currentUser with localStorage whenever it changes
  useEffect(() => {
    if (state.currentUser) {
      const expiryTime = Date.now() + SESSION_TIMEOUT;
      localStorage.setItem("user", JSON.stringify(state.currentUser)); // Save user data
      localStorage.setItem("sessionExpiry", expiryTime.toString()); // Save expiry
    } else {
      localStorage.removeItem("user"); // Clear user on logout
      localStorage.removeItem("sessionExpiry");
    }
  }, [state.currentUser]);

  // Periodically check for session expiration (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      const sessionExpiry = parseInt(localStorage.getItem("sessionExpiry"), 10);
      if (sessionExpiry && Date.now() > sessionExpiry) {
        dispatch({ type: "LOGOUT" }); // Log out user if session expired
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Listen for authentication state changes (i.e., user login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: user });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Handle logout action
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase logout
      dispatch({ type: "LOGOUT" }); // Dispatch logout action
      localStorage.removeItem("user");
      localStorage.removeItem("sessionExpiry");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser: state.currentUser,
        loading,
        dispatch,
        handleLogout, // Add the logout function to context
      }}
    >
      {loading ? (
        <div>Loading...</div> // Show a loading state if required
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
