import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from './pages/context/AuthContext.jsx';
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  </StrictMode>,
)
