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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  BookOpen,
  ChevronLeft,
  CreditCard,
  CheckCircle,
  Lock,
  ChevronRight,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LessonContentView from "./LessonContentView";

const API_URL = "http://localhost:3000";

const formatDate = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

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
      <p className="text-sm text-gray-500">{course.course_description}</p>
    </CardContent>
    <CardFooter>
      <p className="">
        {course.course_price > 0 ? `$${course.course_price}` : "Free"}
      </p>
    </CardFooter>
  </Card>
);

const CourseDetails = ({
  course,
  onBack,
  onEnroll,
  onWithdraw,
  enrollmentStatus,
  enrollmentDate,
  enrollmentId,
}) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    if (enrollmentStatus === "active") {
      fetchLessons();
    } else {
      setLessons([]);
    }
  }, [enrollmentStatus, course.course_id]);

  const fetchLessons = async () => {
    setIsLoadingLessons(true);
    try {
      const response = await fetch(
        `${API_URL}/api/student/course/lessons?courseId=${course.course_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch lessons");
      }

      const lessonsData = await response.json();
      setLessons(lessonsData);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    } finally {
      setIsLoadingLessons(false);
    }
  };

  const handleEnrollClick = () => {
    if (course.course_price > 0) {
      setIsPaymentDialogOpen(true);
    } else {
      onEnroll(course.course_id);
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsPaymentDialogOpen(false);
    setPaymentConfirmed(true);
    setTimeout(() => {
      setPaymentConfirmed(false);
      onEnroll(course.course_id);
    }, 2000);
  };

  const handleOpenLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  if (selectedLesson) {
    return (
      <LessonContentView
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Courses
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {course.course_name}
          </CardTitle>
          <CardDescription>
            Instructor: {course.instructor_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">{course.course_description}</p>
          <br />
          <p className="mb-4">{course.course_details}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          {enrollmentStatus === "active" ? (
            <>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled
              >
                <CheckCircle className="mr-2 h-4 w-4" /> Currently Enrolled
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                Enrolled on {formatDate(enrollmentDate)}
              </p>
            </>
          ) : (
            <>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleEnrollClick}
              >
                {course.course_price > 0 ? (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" /> Enroll for $
                    {course.course_price}
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" /> Enroll in Course
                  </>
                )}
              </Button>
              {enrollmentStatus && (
                <p className="text-sm text-gray-500 mt-2">
                  {enrollmentStatus === "completed"
                    ? `You previously completed this course after enrolling on ${formatDate(
                        enrollmentDate
                      )}`
                    : enrollmentStatus === "withdrawn"
                    ? `You previously withdrew from this course after enrolling on ${formatDate(
                        enrollmentDate
                      )}`
                    : `Previous enrollment status: ${enrollmentStatus} (Enrolled on ${formatDate(
                        enrollmentDate
                      )})`}
                </p>
              )}
            </>
          )}
          {enrollmentStatus === "active" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mt-4">
                  Unenroll from Course
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to unenroll?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. You will lose access to course
                    materials and progress. You will not be refunded and will
                    have to pay for the course again if you wish to re-enroll.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onWithdraw(enrollmentId)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Confirm Unenroll
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          {enrollmentStatus === "active" ? (
            isLoadingLessons ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Loading lessons...</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {lessons.map((lesson) => (
                  <AccordionItem
                    key={lesson.lesson_id}
                    value={`lesson-${lesson.lesson_id}`}
                  >
                    <AccordionTrigger>{`Lesson ${lesson.lesson_number}: ${lesson.lesson_title}`}</AccordionTrigger>
                    <AccordionContent>
                      <p>{lesson.lesson_description}</p>
                      <Button
                        className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => handleOpenLesson(lesson)}
                      >
                        Open Lesson <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )
          ) : (
            <div className="text-center py-4">
              <Lock className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Enroll in this course to view lesson content
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Payment Information</AlertDialogTitle>
          </AlertDialogHeader>
          <form onSubmit={handlePaymentSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="John Doe" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="flex space-x-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </div>
            <br />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Submit Payment
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={paymentConfirmed} onOpenChange={setPaymentConfirmed}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Payment Confirmed</AlertDialogTitle>
            <AlertDialogDescription>
              Your payment has been processed successfully. You will be enrolled
              in the course shortly.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const StudentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [browseCourses, setBrowseCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [pastCourses, setPastCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("enrolled-courses");

  const fetchCourses = async (endpoint) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: "include",
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
    const fetchAllCourses = async () => {
      const allEnrollments = await fetchCourses("/api/student/enrollments");
      setEnrolledCourses(
        allEnrollments.filter((course) => course.enrollment_status === "active")
      );
      setPastCourses(
        allEnrollments.filter((course) => course.enrollment_status !== "active")
      );
    };

    if (activeTab === "enrolled-courses" || activeTab === "past-courses") {
      fetchAllCourses();
    } else if (activeTab === "browse") {
      fetchCourses("/api/courses/all").then(setBrowseCourses);
    }
  }, [activeTab]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSelectedCourse(null);
    setSearchTerm("");
  };

  const confirmPurchase = async (courseId, salePrice) => {
    try {
      const response = await fetch(`${API_URL}/api/student/purchase/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instructorId: selectedCourse.instructor_id,
          courseId: courseId,
          salePrice: salePrice,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to confirm purchase");
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error confirming purchase:", error);
      setError("Error confirming purchase: " + error.message);
    }
  };

  const handleEnroll = async (courseId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/student/enrollments/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ courseId }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to enroll");
      }
      const allEnrollments = await fetchCourses("/api/student/enrollments");
      setEnrolledCourses(
        allEnrollments.filter((course) => course.enrollment_status === "active")
      );
      setPastCourses(
        allEnrollments.filter((course) => course.enrollment_status !== "active")
      );
      setBrowseCourses(await fetchCourses("/api/courses/all"));
      setSelectedCourse((prev) => ({
        ...prev,
        enrollment_status: "active",
        enrollment_date: Math.floor(Date.now() / 1000),
      }));

      if (selectedCourse.course_price > 0) {
        await confirmPurchase(courseId, selectedCourse.course_price);
      }
    } catch (error) {
      setError("Error enrolling in course: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (enrollmentId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/student/enrollments/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ enrollmentId }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to withdraw from course");
      }
      const allEnrollments = await fetchCourses("/api/student/enrollments");
      setEnrolledCourses(
        allEnrollments.filter((course) => course.enrollment_status === "active")
      );
      setPastCourses(
        allEnrollments.filter((course) => course.enrollment_status !== "active")
      );
      setBrowseCourses(await fetchCourses("/api/courses/all"));
      setSelectedCourse((prev) => ({
        ...prev,
        enrollment_status: "withdrawn",
      }));
    } catch (error) {
      setError("Error withdrawing from course: " + error.message);
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
      : activeTab === "enrolled-courses"
      ? enrolledCourses
      : pastCourses;

  const getEnrollmentInfo = (courseId) => {
    const enrolledCourse = enrolledCourses.find(
      (course) => course.course_id === courseId
    );
    if (enrolledCourse)
      return {
        status: "active",
        date: enrolledCourse.enrollment_date,
        id: enrolledCourse.enrollment_id,
      };
    const pastCourse = pastCourses.find(
      (course) => course.course_id === courseId
    );
    return pastCourse
      ? {
          status: pastCourse.enrollment_status,
          date: pastCourse.enrollment_date,
          id: pastCourse.enrollment_id,
        }
      : { status: null, date: null, id: null };
  };

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
          onWithdraw={handleWithdraw}
          enrollmentStatus={getEnrollmentInfo(selectedCourse.course_id).status}
          enrollmentDate={getEnrollmentInfo(selectedCourse.course_id).date}
          enrollmentId={getEnrollmentInfo(selectedCourse.course_id).id}
        />
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="enrolled-courses">Enrolled Courses</TabsTrigger>
            <TabsTrigger value="browse">Browse Courses</TabsTrigger>
            <TabsTrigger value="past-courses">Past Courses</TabsTrigger>
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

          <TabsContent value="enrolled-courses">
            {isLoading ? (
              <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : enrolledCourses.length === 0 ? (
              <div className="flex justify-center items-center h-[calc(100vh-200px)]">
                <p className="text-gray-500 text-lg">
                  You are not enrolled in any courses
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {enrolledCourses.map((course) => (
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

          <TabsContent value="past-courses">
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
        </Tabs>
      )}
    </div>
  );
};

export default StudentDashboard;
