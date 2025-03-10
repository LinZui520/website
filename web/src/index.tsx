import React from 'react';
import ReactDOM from 'react-dom/client';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './index.css';

gsap.registerPlugin(useGSAP);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
