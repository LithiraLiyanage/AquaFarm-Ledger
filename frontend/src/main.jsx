import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './styles/index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
createRoot(document.getElementById('root')).render(<React.StrictMode><AuthProvider><App/><Toaster position="top-right" toastOptions={{style:{borderRadius:'16px'}}}/></AuthProvider></React.StrictMode>);
