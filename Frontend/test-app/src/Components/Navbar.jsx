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
    <nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl 
    bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-6 py-4 
    flex items-center justify-between border border-gray-200"
    >
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Feedback Board
        </h1>
      </div>

      <div className="flex items-center space-x-6">
        <button
          onClick={() => (window.location.href = "/")}
          className="text-gray-700 hover:text-blue-600 font-medium text-base transition-all duration-1000 hover:shadow-2xl  hover:scale-105 hover:-translate-y-1"
        >
          Home
        </button>

        {!isLoggedIn ? (
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-light rounded-lg hover:bg-slate-700 transition-all duration-1000 hover:shadow-2xl hover:text-white hover:scale-105 hover:-translate-y-1 "
          >
            Login
          </button>
        ) : (
          <>
            <button
              onClick={() => (window.location.href = "/profile")}
              className="text-gray-700 hover:text-blue-600 font-medium text-base transition-all duration-1000 hover:scale-105 hover:-translate-y-1"
            >
              Profile
            </button>

            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600 font-medium text-base transition-all duration-1000 hover:-translate-y-1 "
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
