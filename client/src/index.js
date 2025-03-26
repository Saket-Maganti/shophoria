import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

// Create a root
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);