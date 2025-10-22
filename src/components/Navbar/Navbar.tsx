"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Navbar = () => {
  const { isAuthenticated, user, setToken, setUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout error occurred", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setToken(null);
      setUser(null);
      router.push("/login");
    }
  };
  return (
    <nav className="w-full bg-gray-800 p-2">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">
          <Link href="/">
            <Image
              src="/cutestar.png"
              alt="Logo"
              width={100}
              height={100}
              className="h-10 w-10 rounded-full"
            />
          </Link>
        </div>
        
        <div className="flex space-x-8 items-center">
          {isAuthenticated ? (
            <>
              <Link href="/">
                <button className="text-white hover:text-gray-300">
                  Dashboard
                </button>
              </Link>
              <Link href="/about">
                <button className="text-white hover:text-gray-300">About</button>
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-white text-sm">
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="text-white hover:text-gray-300">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
