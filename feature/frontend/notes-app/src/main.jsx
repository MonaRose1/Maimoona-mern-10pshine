import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Landing from './pages/landing/Landing.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/*" element={<Landing />} />
      </Routes>
    </Router>
  </React.StrictMode>
)
