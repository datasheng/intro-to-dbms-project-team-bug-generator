import { useState } from "react";
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
import { ChevronLeft, Plus, ChevronRight } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    price: 49.99, // Default price, change if necessary
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

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-indigo-700 mb-6">
          Instructor Center
        </h1>
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
        <ScrollArea className="h-[calc(100vh-200px)]">
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

      <CreateCourseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateCourse={handleCreateCourse}
      />
    </div>
  );
};

export default InstructorCenter;
