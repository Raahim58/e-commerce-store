import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import logo from '../assets/logo.png'; // Adjust path according to your project structure

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 w-full vibg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logo} 
              alt="Rasp-Commerce Logo" 
              className="w-15 h-12" 
            />
            <span className="text-2xl font-bold text-emerald-300">rasp-commerce</span>
          </Link>

          <nav className="flex flex-wrap items-center gap-4">
            {user && (
              <Link
                to={"/cart"}
                className="relative group text-white hover:bg-emerald-600 hover:text-black px-2 py-1 rounded-md transition duration-300 ease-in-out"
              >
                <ShoppingCart
                  className="inline-block mr-1"
                  size={18}
                />
                {/* <span className="hidden sm:inline">cart</span> */}
                {cart.length > 0 && (
                  <span
                    className="absolute -top-2 -left-2 bg-emerald-500 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-emerald-400 transition duration-300 ease-in-out"
                  >
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                className="hover:bg-emerald-600 text-white px-2 py-1 rounded-md hover:text-black font-medium transition duration-300 ease-in-out flex items-center"
                to={"/secret-dashboard"}
              >
                <Lock className="inline-block m-1" size={18} />
                {/* <span className="hidden sm:inline">dashboard</span> */}
              </Link>
            )}

            {user ? (
              <button
                className=" hover:bg-gray-600 text-white py-2 px-3 hover:text-black rounded-md flex items-center transition duration-300 ease-in-out"
                onClick={logout}
              >
                <LogOut size={18} />
                {/* <span className='hidden sm:inline ml-2'>log Out</span> */}
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out hover:text-black"
                >
                  <UserPlus className="mr-2" size={18} />
                  
                </Link>
                <Link
                  to={"/login"}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out hover:text-black"
                >
                  <LogIn className="mr-2" size={18} />
                  
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
