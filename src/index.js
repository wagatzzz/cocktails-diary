import React from 'react';
import { createRoot } from 'react-dom/client'; // React 18 API
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
