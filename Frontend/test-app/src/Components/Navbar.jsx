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
    window.location.href = "/login";
  };

  return (
    <nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-6xl 
      bg-white/90 backdrop-blur-md shadow-lg rounded-2xl px-6 py-3 
      flex items-center justify-between border border-gray-200"
    >
      <div>
        <h1
          onClick={() => (window.location.href = "/")}
          className="text-xl font-bold text-blue-700 cursor-pointer"
        >
          Feedback Board
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition hover:-translate-y-1"
          >
            Login
          </button>
        ) : (
          <>
            <button
              onClick={() => (window.location.href = "/profile")}
              className="px-4 py-2 bg-gradient-to-r from-violet-800 to via-violet-700 text-white text-sm rounded-lg hover:bg-indigo-700 transition hover:-translate-y-1"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition hover:-translate-y-1"
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
