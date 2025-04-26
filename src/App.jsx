import React, { useEffect } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider 
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Layout Component
import Layout from './Layouts/Layout';

// Page Components
import Home from './pages/Home';
import BlogList from './components/BlogList'; // Assuming BlogList handles /blog and /blog/tag/:tag
import BlogPost from './components/BlogPost';
// import NotFound from './pages/NotFound'; // Optional: Create a 404 page

// Import base CSS
import "./index.css"; 

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Use Layout component for the main structure
    // TODO: Add ErrorBoundary component if desired
    // errorElement: <ErrorPage />,
    children: [
      { 
        index: true, // Matches "/" path exactly
        element: <Home /> 
      },
      {
        path: "blog",
        element: <BlogList />,
      },
      {
        path: "blog/tag/:tag", // Route for specific tags
        element: <BlogList />,
      },
      {
        path: "blog/:slug", // Route for single blog posts
        element: <BlogPost />,
      },
      // TODO: Add other top-level pages as children if needed (e.g., /about, /contact-page)
      // {
      //   path: "*",
      //   element: <NotFound /> // Catch-all 404 route
      // },
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
