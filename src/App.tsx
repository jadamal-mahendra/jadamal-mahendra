import React, { useEffect } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider 
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Layout Component
// import ChatErrorBoundary from './components/ChatErrorBoundary/ChatErrorBoundary'; // Removed unused import

// Page Components
import Home from './pages/Home';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
// Import the new layout component
import AppLayout from "./applayouts/AppLayout"; 

// Import base CSS
import "./styles/index.css";

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    // element: <AppLayout />, // Remove Layout component from root element
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
    <AppLayout>
      <RouterProvider router={router} />
    </AppLayout>
  );
};

export default App;
