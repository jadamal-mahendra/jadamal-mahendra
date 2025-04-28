import React, { useEffect } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider 
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Layout Component
import ChatErrorBoundary from '@/components/ChatErrorBoundary/ChatErrorBoundary';

// Page Components
import Home from '@/pages/Home';
import BlogListPage from '@/pages/BlogListPage';
import BlogPostPage from '@/pages/BlogPostPage';

// Import base CSS
import "@/styles/index.css";
import Layout from './layouts/Layout';

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout component for the main structure
    children: [
      {
        index: true, // Matches "/" path exactly
        element: <Home />
      },
      {
        path: "blog",
        element: <BlogListPage />,
      },
      {
        path: "blog/tag/:tag", // Route for specific tags
        element: <BlogListPage />,
      },
      {
        path: "blog/:slug", // Route for single blog posts
        element: <BlogPostPage />,
      },
    ],
  },
]);

const App = () => {
  // Initialize AOS once here for the whole application
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      offset: 120, 
      once: true, 
      delay: 100, 
      easing: 'ease-out-cubic',
    });
  }, []);

  return (
    // Removed ParallaxProvider and Helmet as they are likely handled 
    // in main.jsx or within specific page components/Layout
    // Removed direct rendering of sections/Navbar/Footer
    <RouterProvider router={router} />
  );
};

export default App;
