import React, { useContext } from 'react'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'

import "aos/dist/aos.css"
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Error  from './pages/Error'
import Logout from './pages/Logout'
import Footer from './components/Footer'

import Togglebtn from './components/Togglebtn'
import User from './pages/User'
import { AuthContext } from './pages/context/AuthContext'
import Book from './pages/Book'
import ResearchPaper from './pages/ReseachPaper'
import BookDetails from './pages/BookDetails'
import AdminPanel from './pages/AdminPanel'
import PrivacyTerms from './pages/PrivacyTerms'

export default function App() {
  const {currentUser,loading} =useContext(AuthContext);

 const RequireAuth=({children})=>{
  return currentUser ? children : <Navigate to="/login"/>
 }
 if (loading) {
  // Show a spinner or a placeholder while authentication is being verified
  return <div>Loading...</div>;
}
  
  return (
    <div >
      <BrowserRouter>
      <Togglebtn/>
      <Navbar/>
      <Routes>
        <Route
        path='/' 
        element={<Home/>}/>
        <Route
        path='/about' 
        element={<About/>}/>
        <Route
        path='/contact' 
        element={<Contact/>}/>
        <Route
        path='/books' 
        element={<Book/>}/>
        <Route path="/books/:branch" element={<BookDetails />} />
         <Route
        path='/research-papers' 
        element={<ResearchPaper/>}/>
        <Route
        path='/login' 
        element={<Login/>}/>
        <Route path="/admin" element={<AdminPanel/>} /> 
        <Route
        path='/signup' 
        element={<Signup/>}/>
        <Route
        path='/user' 
        element={<RequireAuth><User/></RequireAuth>}/>
         <Route
        path='/logout' 
        element={<Logout/>}/>
        <Route path="/privacy-terms" element={<PrivacyTerms />} />
        <Route
        path='*'
        element={<Error/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>
    </div>
  )
}
