import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for createRoot
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // Import your main App component

// Get the root DOM element
const rootElement = document.getElementById('root');

// Create a React root and render the app
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
