import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, BookOpen, User, ChevronLeft } from "lucide-react";

const API_URL = "http://localhost:3000";

const CourseCard = ({ course, onClick }) => (
  <Card
    className="cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onClick(course)}
  >
    <CardHeader>
      <CardTitle>{course.title}</CardTitle>
      <CardDescription>{course.instructor}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="line-clamp-2">{course.description}</p>
    </CardContent>
    <CardFooter>
      <p className="text-sm text-gray-500">
        Enrolled Students: {course.enrolledStudents}
      </p>
    </CardFooter>
  </Card>
);

const CourseDetails = ({ course, onBack, onEnroll }) => (
  <div className="space-y-6">
    <Button onClick={onBack} variant="ghost">
      <ChevronLeft className="mr-2 h-4 w-4" /> Back to Courses
    </Button>
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
        <CardDescription>Instructor: {course.instructor}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{course.description}</p>
        <p className="text-sm text-gray-500">
          Enrolled Students: {course.enrolledStudents}
        </p>
      </CardContent>
      <CardFooter>
        {course.enrolled ? (
          <Button variant="outline" disabled>
            Already Enrolled
          </Button>
        ) : (
          <Button onClick={() => onEnroll(course.id)}>
            <BookOpen className="mr-2 h-4 w-4" /> Enroll in Course
          </Button>
        )}
      </CardFooter>
    </Card>
  </div>
);

const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState({
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Student",
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [browseCourses, setBrowseCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  const fetchCourses = async (endpoint) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "browse") {
      fetchCourses("/browse-courses").then(setBrowseCourses);
    } else if (activeTab === "my-courses") {
      fetchCourses("/my-courses").then(setMyCourses);
    }
  }, [activeTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSelectedCourse(null);
    setSearchTerm("");
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    console.log("Updating profile:", user);
  };

  const handleEnroll = async (courseId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/enroll`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId }),
      });
      if (!response.ok) {
        throw new Error("Failed to enroll");
      }
      // Refresh the course lists after successful enrollment
      fetchCourses("/api/courses").then(setBrowseCourses);
      fetchCourses("/api/enrollments").then(setMyCourses);
      setSelectedCourse((prev) => ({ ...prev, enrolled: true }));
    } catch (error) {
      console.error("Error enrolling in course:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses =
    activeTab === "browse"
      ? browseCourses.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : myCourses;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-indigo-700">
          Student Center
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              {user.fullName}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateProfile}>
              {/* Profile edit form fields */}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {selectedCourse ? (
        <CourseDetails
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onEnroll={handleEnroll}
        />
      ) : (
        <>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="browse">Browse Courses</TabsTrigger>
              <TabsTrigger value="my-courses">My Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-4">
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              {isLoading ? (
                <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onClick={setSelectedCourse}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="my-courses">
              {isLoading ? (
                <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {myCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onClick={setSelectedCourse}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
