import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChevronLeft,
  Plus,
  ChevronRight,
  FileSpreadsheet,
  Info,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const mockInstructorCourses = [
  {
    id: 1,
    title: "Introduction to React",
    description: "Learn the basics of React and build your first app.",
    price: 49.99,
    enrolledStudents: [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ],
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    description: "Dive deep into JavaScript concepts and advanced techniques.",
    price: 69.99,
    enrolledStudents: [
      { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    ],
  },
  {
    id: 3,
    title: "Advanced Database Design",
    description: "Learn advanced database design concepts and best practices.",
    price: 0,
    enrolledStudents: [
      { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    ],
  },
];

const MockLessons = [
  {
    id: 11,
    title: "Introduction to React",
    description: "Learn the basics of React and build your first app.",
    course_id: 1,
  },
  {
    id: 12,
    title: "React Components",
    description: "Understand the concept of components and how to create them.",
    course_id: 1,
  },
  {
    id: 13,
    title: "State and Props",
    description: "Learn about state and props in React and how to manage them.",
    course_id: 1,
  },
  {
    id: 14,
    title: "React Lifecycle Methods",
    description: "Explore the lifecycle methods of React components.",
    course_id: 1,
  },
  {
    id: 15,
    title: "Handling Events",
    description: "Learn how to handle events in React.",
    course_id: 3,
  },
  {
    id: 16,
    title: "React Hooks",
    description: "Get introduced to React Hooks and how to use them.",
    course_id: 2,
  },
];

const CourseCard = ({ course, onClick }) => (
  <Card
    className="cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onClick(course)}
  >
    <CardHeader>
      <CardTitle>{course.title}</CardTitle>
      <CardDescription>
        {course.enrolledStudents.length} students enrolled
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-gray-500">{course.description}</p>
    </CardContent>
    <CardFooter>
      <p className="">{course.price > 0 ? `$${course.price}` : "Free"}</p>
    </CardFooter>
  </Card>
);

const CourseDetails = ({ course, onBack, onSave, onDelete }) => {
  const [editedCourse, setEditedCourse] = useState(course);

  const handleSave = () => {
    onSave(editedCourse);
  };

  const handleDelete = () => {
    onDelete(editedCourse.id);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value);
    setEditedCourse({
      ...editedCourse,
      price: isNaN(parsedValue) ? value : parsedValue,
    });
  };

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Courses
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={editedCourse.title}
              onChange={(e) =>
                setEditedCourse({ ...editedCourse, title: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              value={editedCourse.description}
              onChange={(e) =>
                setEditedCourse({
                  ...editedCourse,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              placeholder="Price"
              className="w-24"
              value={editedCourse.price}
              onChange={handlePriceChange}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Enrolled Students</h3>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              {editedCourse.enrolledStudents.map((student) => (
                <div key={student.id} className="mb-2">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
              ))}
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleSave}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const Lessons = ({ lessons, course }) => {
  const filteredLessons = lessons.filter(
    (lesson) => lesson.course_id === course.id
  );
  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lessons</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Add Lesson
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Input lesson name and content here.</DialogTitle>
                  <br />
                  <Label>Lesson Title</Label>
                  <Input placeholder="Lesson Title" />
                  <Label>Lesson description</Label>
                  <Textarea placeholder="Lesson Content" />
                </DialogHeader>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Create Lesson
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredLessons.map((lesson, index) => (
              <AccordionItem value={`item-${index + 1}`}>
                <AccordionTrigger>{`Lesson ${index + 1}: ${
                  lesson.title
                }`}</AccordionTrigger>
                <AccordionContent>
                  <p>{lesson.description}</p>
                  <br />
                  <div className="flex items-center space-x-2">
                    <Link to="LessonPage">
                      <p>
                        <u>Edit Lesson</u>
                      </p>
                    </Link>
                    <Button variant="ghost">
                      <u>Delete Lesson</u>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

const CreateCourseModal = ({ isOpen, onClose, onCreateCourse }) => {
  const [step, setStep] = useState(1);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    content: "",
    price: 0,
  });
  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  const handleCreate = () => {
    onCreateCourse(newCourse);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                value={newCourse.title}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, title: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                value={newCourse.description}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, description: e.target.value })
                }
              />
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={newCourse.price}
                onChange={(e) => {
                  let value = parseFloat(e.target.value);
                  if (isNaN(value) || value < 0) {
                    value = 0;
                  }
                  setNewCourse({ ...newCourse, price: value });
                }}
                placeholder="Price"
                className="w-24"
              />
            </div>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              style={{ float: "right" }}
              onClick={handleNext}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Course Details</Label>
              <Textarea
                id="content"
                value={newCourse.content}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, content: e.target.value })
                }
                className="h-[200px]"
              />
            </div>
            <div className="flex justify-between">
              <Button onClick={handlePrevious} variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleCreate}
              >
                Create Course
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const InstructorCenter = () => {
  const [courses, setCourses] = useState(mockInstructorCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [lessons, setLessons] = useState(MockLessons);
  const [activeTab, setActiveTab] = useState("courses");
  const [earningsData, setEarningsData] = useState([]);
  const [earningsTimeframe, setEarningsTimeframe] = useState("1m");

  useEffect(() => {
    if (activeTab === "earnings") {
      fetchEarningsData();
    }
  }, [activeTab, earningsTimeframe]);

  const fetchEarningsData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/instructor/earnings",
        {
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch earnings data");
      }
      const data = await response.json();
      const dataWithNetEarnings = data.map((item) => ({
        ...item,
        net_earnings: calculateNetEarnings(item.course_price),
      }));
      setEarningsData(dataWithNetEarnings);
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    }
  };

  const calculateNetEarnings = (price) => {
    return price * 0.9;
  };

  const formatDate = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const prepareChartData = () => {
    const now = new Date();
    let filteredData = earningsData;

    if (earningsTimeframe === "1m") {
      filteredData = earningsData.filter(
        (item) =>
          item.enrollment_date >=
          Math.floor(now.setMonth(now.getMonth() - 1) / 1000)
      );
    } else if (earningsTimeframe === "6m") {
      filteredData = earningsData.filter(
        (item) =>
          item.enrollment_date >=
          Math.floor(now.setMonth(now.getMonth() - 6) / 1000)
      );
    } else if (earningsTimeframe === "1y") {
      filteredData = earningsData.filter(
        (item) =>
          item.enrollment_date >=
          Math.floor(now.setFullYear(now.getFullYear() - 1) / 1000)
      );
    }

    const groupedData = filteredData.reduce((acc, item) => {
      const date = formatDate(item.enrollment_date);
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += item.net_earnings;
      return acc;
    }, {});

    return Object.entries(groupedData)
      .map(([date, earnings]) => ({
        date,
        earnings,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const formatDateForCSV = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleExportCSV = () => {
    const csvContent = [
      [
        "Date",
        "Student Name",
        "Student Email",
        "Course Name",
        "Price",
        "Net Earnings",
      ],
      ...earningsData.map((sale) =>
        [
          formatDateForCSV(sale.enrollment_date),
          sale.student_full_name,
          sale.student_email || "N/A",
          sale.course_name,
          sale.course_price,
          sale.net_earnings,
        ].map((field) => `"${field}"`)
      ),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "earnings_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderEarningsTab = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Earnings</h2>
        <Button
          onClick={handleExportCSV}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export CSV Data
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            Earnings Overview
          </CardTitle>
          <div className="flex space-x-1">
            {["1M", "6M", "1Y", "ALL"].map((timeframe) => (
              <Button
                key={timeframe}
                variant={
                  earningsTimeframe.toUpperCase() === timeframe
                    ? "default"
                    : "outline"
                }
                onClick={() => setEarningsTimeframe(timeframe.toLowerCase())}
                className="h-8 px-3 text-xs"
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepareChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
              />
              <YAxis />
              <RechartsTooltip
                formatter={(value, name) => [formatCurrency(value), "Earnings"]}
                labelFormatter={(label) =>
                  `Date: ${new Date(label).toLocaleDateString()}`
                }
              />
              <Line type="monotone" dataKey="earnings" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Student Email</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                  <div className="flex items-center">
                    Net Earnings
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Net Earnings after Chalkboard's 10% platform fee</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earningsData
                .sort((a, b) => b.enrollment_date - a.enrollment_date)
                .map((sale, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatDate(sale.enrollment_date)}</TableCell>
                    <TableCell>{sale.student_full_name}</TableCell>
                    <TableCell>{sale.student_email || "N/A"}</TableCell>
                    <TableCell>{sale.course_name}</TableCell>
                    <TableCell>{formatCurrency(sale.course_price)}</TableCell>
                    <TableCell>{formatCurrency(sale.net_earnings)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const handleCreateCourse = (newCourse) => {
    const courseWithId = {
      ...newCourse,
      id: courses.length + 1,
      enrolledStudents: [],
    };
    setCourses([...courses, courseWithId]);
  };

  const handleSaveCourse = (editedCourse) => {
    setCourses(
      courses.map((course) =>
        course.id === editedCourse.id ? editedCourse : course
      )
    );
    setSelectedCourse(null);
  };

  const handleDeleteCourse = (courseId) => {
    setCourses(courses.filter((course) => course.id !== courseId));
    setSelectedCourse(null);
  };

  const renderCoursesTab = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Courses</h2>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Course
        </Button>
      </div>
      {selectedCourse ? (
        <>
          <CourseDetails
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
            onSave={handleSaveCourse}
            onDelete={handleDeleteCourse}
          />
          <Lessons lessons={lessons} course={selectedCourse} />
        </>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={setSelectedCourse}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </>
  );

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 max-w-7xl">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-indigo-700 mb-6">
          Instructor Center
        </h1>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="courses">{renderCoursesTab()}</TabsContent>

          <TabsContent value="earnings">{renderEarningsTab()}</TabsContent>
        </Tabs>

        <CreateCourseModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateCourse={handleCreateCourse}
        />
      </div>
    </TooltipProvider>
  );
};

export default InstructorCenter;
