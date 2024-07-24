import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Search } from "lucide-react";
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

const API_URL = "http://localhost:3000";

const CourseCard = ({ course }) => (
  <Card className="flex flex-col justify-between">
    <CardHeader>
      <CardTitle>{course.course_name}</CardTitle>
      <CardDescription>Instructor: {course.instructor_name}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="line-clamp-3">{course.course_description}</p>
    </CardContent>
    <CardFooter className="flex flex-col items-start gap-4">
      <div className="w-full">
        <p className="text-sm text-gray-500 mb-2">
          Register or Sign In to enroll
        </p>
        <div className="flex gap-2">
          <Link to="/register" className="flex-1">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              Register
            </Button>
          </Link>
          <Link to="/signin" className="flex-1">
            <Button variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </CardFooter>
  </Card>
);

const CourseExplorer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/courses`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-indigo-700 mb-6">
        Explore Courses
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCourses.map((course) => (
              <CourseCard key={course.course_id} course={course} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default CourseExplorer;
