import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-2 z-50 w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border border-gray-200 mb-6">
      <div className="flex-shrink-0">
        <h1 className="text-base sm:text-xl font-bold text-gray-800">
          Feedback Board
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
        <button
          onClick={() => (window.location.href = "/")}
          className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:-translate-y-1 px-2 py-1 rounded-lg hover:bg-blue-50"
        >
          Home
        </button>

        {!isLoggedIn ? (
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-3 sm:px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            Login
          </button>
        ) : (
          <>
            <button
              onClick={() => (window.location.href = "/profile")}
              className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:-translate-y-1 px-2 py-1 rounded-lg hover:bg-blue-50"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 font-medium text-sm sm:text-base transition-all duration-300 hover:-translate-y-1 px-2 py-1 rounded-lg hover:bg-red-50"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;