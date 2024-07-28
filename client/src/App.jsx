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
  GraduationCap,
  DollarSign,
  Globe,
  Clock,
  BookText,
  Presentation,
} from "lucide-react";
import LoginRegister from "./components/LoginRegister";
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
import CourseExplorer from "./components/CourseExplorer";
import LessonPage from "./components/LessonPage";
import Metrics from "./components/Metrics";
import Contents from "./components/Contents";

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link to="/" className="flex items-center py-4 px-2">
                <GraduationCap className="h-8 w-8 text-indigo-600 mr-2" />
                <span className="font-bold text-2xl tracking-tight text-indigo-600">
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
                      <BookText className="mr-2 h-4 w-4" />
                      <span>Student Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/instructor-center">
                    <DropdownMenuItem>
                      <Presentation className="mr-2 h-4 w-4" />
                      <span>Instructor Center</span>
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
  <Card className="flex flex-col items-center text-center">
    <CardHeader className="items-center">
      {" "}
      {}
      <div className="mb-4">{icon}</div>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardDescription className="text-center px-4 pb-4">
      {description}
    </CardDescription>
  </Card>
);

const HomePage = ({ user }) => (
  <div className="container mx-auto px-4">
    <section className="text-center py-20">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Welcome to Chalkboard
      </h1>
      <p className="text-xl mb-8">
        A peer to peer course-based learning and instruction platform.
      </p>
      <Link to={user ? "/dashboard" : "/courses"}>
        <Button
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {user ? "Dashboard" : "Explore Courses"}
        </Button>
      </Link>
    </section>

    <section className="py-20">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-12 text-center">
        Why Choose Chalkboard?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <Feature
          icon={<BookOpen className="h-12 w-12 text-indigo-500" />}
          title="Wide Range of Courses"
          description="Access a diverse selection of courses from various disciplines, catering to all learning needs and interests."
        />
        <Feature
          icon={<Users className="h-12 w-12 text-indigo-500" />}
          title="Learn or Teach"
          description="Sign up as a student to learn, or become an instructor to share your expertise with a global audience."
        />
        <Feature
          icon={<Award className="h-12 w-12 text-indigo-500" />}
          title="Earn Certificates"
          description="Complete courses and earn certificates to boost your skills and enhance your professional profile."
        />
        <Feature
          icon={<DollarSign className="h-12 w-12 text-indigo-500" />}
          title="Monetize Your Skills"
          description="As an instructor, charge for your courses and turn your knowledge into earnings."
        />
        <Feature
          icon={<Globe className="h-12 w-12 text-indigo-500" />}
          title="Global Community"
          description="Connect with learners and instructors from around the world, expanding your network and perspectives."
        />
        <Feature
          icon={<Clock className="h-12 w-12 text-indigo-500" />}
          title="Learn at Your Pace"
          description="Access course materials anytime, anywhere. Learn on your schedule with our flexible platform."
        />
      </div>
    </section>

    <section className="py-20 bg-indigo-50 rounded-lg text-center">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 mb-4">
        Ready to Start Your Learning Journey?
      </h2>
      <p className="text-xl mb-8">
        Join Chalkboard today and unlock a world of knowledge for free!
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/register">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Register
          </Button>
        </Link>
        <Link to="/signin">
          <Button
            size="lg"
            variant="outline"
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            Sign In
          </Button>
        </Link>
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
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/courses" element={<CourseExplorer />} />
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
        <Route path="/dashboard" element={<StudentDashboard user={user} />} />
        <Route
          path="/instructor-center"
          element={<InstructorCenter user={user} />}
        />
        <Route
          path="/instructor-center/lesson"
          element={<LessonPage user={user} />}
        />
        <Route path="/metrics" element={<Metrics />} />
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
