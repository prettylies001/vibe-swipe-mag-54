
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Find the root element
const rootElement = document.getElementById("root");

// Ensure the root element exists
if (!rootElement) {
  throw new Error("Root element not found");
}

// Create root and render the application
createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
