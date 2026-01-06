import React from 'react';
import { createRoot } from 'react-dom/client';
// FIX: Corrected import for App component. The issue was placeholder content in App.tsx.
import App from './App';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}