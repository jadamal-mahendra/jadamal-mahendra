import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Main App layout component will handle internal sections */}
          <Route path="/" element={<App />} /> 
          
          {/* Blog Routes */}
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog/tag/:tag" element={<BlogList />} />
    
          {/* TODO: Add a 404 Not Found route */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
