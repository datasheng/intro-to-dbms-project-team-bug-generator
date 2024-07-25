import React, { useState, useEffect } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, BookOpen, ChevronLeft } from "lucide-react";

const API_URL = "http://localhost:3000";

const CourseCard = ({ course, onClick }) => (
  <Card
    className="cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onClick(course)}
  >
    <CardHeader>
      <CardTitle>{course.course_name}</CardTitle>
      <CardDescription>Instructor: {course.instructor_name}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="line-clamp-2">{course.course_description}</p>
    </CardContent>
    <CardFooter>
      <p className="text-sm text-gray-500">
        {course.course_price > 0 ? `$${course.course_price}` : "Free"}
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
        <CardTitle className="text-2xl font-bold">
          {course.course_name}
        </CardTitle>
        <CardDescription>{course.course_id}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{course.course_description}</p>
        <p className="text-sm text-gray-500">
          Instructor: {course.instructor_name}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => onEnroll(course.course_id)}
        >
          <BookOpen className="mr-2 h-4 w-4" />{" "}
          {course.course_price > 0
            ? `Enroll for $${course.course_price}`
            : "Enroll in Course"}
        </Button>
      </CardFooter>
    </Card>
  </div>
);

const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [browseCourses, setBrowseCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("browse");

  const fetchCourses = async (endpoint) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: "include", // to include the auth cookie
      });
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setError(error.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "browse") {
      fetchCourses("/api/courses").then(setBrowseCourses);
    } else if (activeTab === "my-courses") {
      fetchCourses("/api/enrollments").then(setMyCourses);
    }
  }, [activeTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSelectedCourse(null);
    setSearchTerm("");
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
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to enroll");
      }
      // Refresh the course lists after successful enrollment
      await Promise.all([
        fetchCourses("/api/courses").then(setBrowseCourses),
        fetchCourses("/api/enrollments").then(setMyCourses),
      ]);
      setSelectedCourse((prev) => ({ ...prev, enrolled: true }));
    } catch (error) {
      setError("Error enrolling in course: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses =
    activeTab === "browse"
      ? browseCourses.filter(
          (course) =>
            course.course_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            course.instructor_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            course.course_description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      : myCourses;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-indigo-700 mb-6">
        Student Dashboard
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {selectedCourse ? (
        <CourseDetails
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onEnroll={handleEnroll}
        />
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="browse">Browse Courses</TabsTrigger>
            <TabsTrigger value="my-courses">Enrolled Courses</TabsTrigger>
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
      )}
    </div>
  );
};

export default StudentDashboard;
