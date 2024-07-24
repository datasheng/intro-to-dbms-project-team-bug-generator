import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { BookOpen, Users, Award } from "lucide-react";

// Import the LoginRegister component we created earlier
import LoginRegister from "./components/LoginRegister";
import SelectionPage from "./components/Selection";
<<<<<<< Updated upstream
// import InstructorPage from "./components/InstructorPage";
=======
import StudentDashboard from "./components/StudentDashboard";
import InstructorCenter from "./components/InstructorCenter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
>>>>>>> Stashed changes

const Navbar = () => (
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
        <div className="hidden md:flex items-center space-x-3 ">
          <Link
            to="/signin"
            className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-indigo-500 hover:text-white transition duration-300"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="py-2 px-2 font-medium text-white bg-indigo-500 rounded hover:bg-indigo-400 transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  </nav>
);

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

<<<<<<< Updated upstream
=======
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
        <Route path="/InstructorCenter" element={<InstructorCenter user={user} />} />
        
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
};

>>>>>>> Stashed changes
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<LoginRegister isLogin={true} />} />
          <Route path="/register" element={<LoginRegister isLogin={false} />} />
          <Route path="/selection" element={<SelectionPage />} />
          {/* <Route path="/instructor" element={<InstructorPage />} /> */}
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
