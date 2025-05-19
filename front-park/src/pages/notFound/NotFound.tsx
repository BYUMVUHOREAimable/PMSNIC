
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-3xl px-4 py-10">
        <div className="relative">
       
          <div className="absolute inset-0 flex items-center justify-center">
           
          </div>
        </div>

        <div className="text-center mt-8 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">
             Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-300"
          >
            <span>Return to Homepage</span>
           
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;