import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import {
  BookOpen,
  Users,
  Award,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LoginRegister from "./components/LoginRegister";
import SelectionPage from "./components/Selection";
import StudentDashboard from "./components/StudentDashboard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">
                  Chalkboard
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user}</span>
                    {isOpen ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/dashboard">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="primary"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const Feature = ({ icon, title, description }) => (
  <div className="p-6 border rounded-lg shadow-sm">
    {icon}
    <h3 className="mt-5 mb-2 text-lg font-semibold">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HomePage = () => (
  <div className="container mx-auto px-4">
    <section className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to Chalkboard</h1>
      <p className="text-xl mb-8">Your Digital Course Inventory Platform</p>
      <Link
        to="/courses"
        className="bg-indigo-500 text-white font-bold py-2 px-4 rounded hover:bg-indigo-600 transition duration-300"
      >
        Explore Courses
      </Link>
    </section>

    <section className="py-20">
      <h2 className="text-3xl font-bold text-center mb-12">
        Why Choose Chalkboard?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <Feature
          icon={<BookOpen className="h-12 w-12 text-indigo-500" />}
          title="Wide Range of Courses"
          description="Access a diverse selection of courses from various disciplines."
        />
        <Feature
          icon={<Users className="h-12 w-12 text-indigo-500" />}
          title="Learn or Teach"
          description="Sign up as a student or create your own courses as an instructor."
        />
        <Feature
          icon={<Award className="h-12 w-12 text-indigo-500" />}
          title="Earn Certificates"
          description="Complete courses and earn certificates to boost your skills."
        />
      </div>
    </section>
  </div>
);

const AppContent = () => {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (
          document.cookie
            .split(";")
            .some((item) => item.trim().startsWith("auth="))
        ) {
          const response = await fetch("http://localhost:3000/auth/verify", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user.name);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData.fullName);
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    try {
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signin"
          element={
            <LoginRegister isLogin={true} onLoginSuccess={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={
            <LoginRegister isLogin={false} onLoginSuccess={handleLogin} />
          }
        />
        <Route path="/selection" element={<SelectionPage user={user} />} />
        <Route path="/dashboard" element={<StudentDashboard user={user} />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
