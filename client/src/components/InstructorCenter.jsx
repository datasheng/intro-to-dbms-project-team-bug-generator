import { useState, useEffect } from "react";
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
  DialogFooter,
  DialogDescription,
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

const API_URL = "http://localhost:3000";

const CourseCard = ({ course, onClick }) => (
  <Card
    className="cursor-pointer hover:shadow-md transition-shadow"
    onClick={() => onClick(course)}
  >
    <CardHeader>
      <CardTitle>{course.course_name}</CardTitle>
      <CardDescription>
        {course.enrolled_students.length} students enrolled
      </CardDescription>
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

const CourseDetails = ({ course, onBack, onSave }) => {
  const [editedCourse, setEditedCourse] = useState(course);
  const [lessons, setLessons] = useState([]);
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState(false);
  const [isEditLessonDialogOpen, setIsEditLessonDialogOpen] = useState(false);
  const [isDeleteLessonDialogOpen, setIsDeleteLessonDialogOpen] =
    useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isManagingContent, setIsManagingContent] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/instructor/course/lessons?courseId=${course.course_id}`,
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
    }
  };

  const handleAddLesson = async (newLesson) => {
    try {
      const response = await fetch(
        `${API_URL}/api/instructor/course/lessons/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newLesson),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create lesson");
      }

      await fetchLessons();
    } catch (error) {
      console.error("Error creating lesson:", error);
    }
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setIsEditLessonDialogOpen(true);
  };

  const handleSaveLesson = async (editedLesson) => {
    try {
      const response = await fetch(
        `${API_URL}/api/instructor/course/lessons/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            lesson_id: editedLesson.lesson_id,
            course_id: editedLesson.course_id,
            lesson_number: editedLesson.lesson_number,
            lesson_title: editedLesson.lesson_title,
            lesson_description: editedLesson.lesson_description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update lesson");
      }

      await fetchLessons();
    } catch (error) {
      console.error("Error updating lesson:", error);
    }
  };

  const handleSave = () => {
    onSave(editedCourse);
  };

  const handleDeleteLesson = async (lessonToDelete) => {
    try {
      const response = await fetch(
        `${API_URL}/api/instructor/course/lessons/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            lesson_id: lessonToDelete.lesson_id,
            course_id: course.course_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete lesson");
      }

      await fetchLessons();
    } catch (error) {
      console.error("Error deleting lesson:", error);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setEditedCourse({
        ...editedCourse,
        course_price: value,
      });
    }
  };

  const calculateNetEarnings = (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "0.00";
    return (numPrice * 0.9).toFixed(2);
  };

  const handleManageContent = (lesson) => {
    setSelectedLesson(lesson);
    setIsManagingContent(true);
  };

  if (isManagingContent) {
    return (
      <ContentManagement
        lesson={selectedLesson}
        onBack={() => {
          setIsManagingContent(false);
          setSelectedLesson(null);
        }}
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
          <CardTitle className="text-2xl font-bold">Edit Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              value={editedCourse.course_name}
              onChange={(e) =>
                setEditedCourse({
                  ...editedCourse,
                  course_name: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              value={editedCourse.course_description}
              onChange={(e) =>
                setEditedCourse({
                  ...editedCourse,
                  course_description: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  placeholder="Price"
                  className="w-24"
                  value={editedCourse.course_price}
                  onChange={handlePriceChange}
                />
              </div>
              <div>
                <Label htmlFor="netEarnings">Net Earnings</Label>
                <Input
                  id="netEarnings"
                  className="w-24"
                  value={calculateNetEarnings(editedCourse.course_price)}
                  readOnly
                />
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Chalkboard deducts a 10% seller fee to support our platform.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Enrolled Students</h3>
            <ScrollArea className="h-[200px] border rounded-md p-4">
              {editedCourse.enrolled_students.map((student, index) => (
                <div key={index} className="mb-2">
                  <p className="font-medium">{student.full_name}</p>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Lessons</CardTitle>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setIsAddLessonDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Lesson
          </Button>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {lessons.map((lesson) => (
              <AccordionItem
                key={lesson.lesson_id}
                value={`lesson-${lesson.lesson_id}`}
              >
                <AccordionTrigger>{`Lesson ${lesson.lesson_number}: ${lesson.lesson_title}`}</AccordionTrigger>
                <AccordionContent>
                  <p>{lesson.lesson_description}</p>
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEditLesson(lesson)}
                    >
                      Edit Details
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleManageContent(lesson)}
                    >
                      Manage Content
                    </Button>
                    <Button
                      variant="outline"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSelectedLesson(lesson);
                        setIsDeleteLessonDialogOpen(true);
                      }}
                    >
                      Delete Lesson
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
      <AddLessonDialog
        isOpen={isAddLessonDialogOpen}
        onClose={() => setIsAddLessonDialogOpen(false)}
        onAddLesson={handleAddLesson}
        courseId={course.course_id}
      />
      <EditLessonDialog
        isOpen={isEditLessonDialogOpen}
        onClose={() => {
          setIsEditLessonDialogOpen(false);
          setSelectedLesson(null);
        }}
        onSaveLesson={handleSaveLesson}
        lesson={selectedLesson}
        courseId={course.course_id}
      />
      <DeleteLessonDialog
        isOpen={isDeleteLessonDialogOpen}
        onClose={() => {
          setIsDeleteLessonDialogOpen(false);
          setSelectedLesson(null);
        }}
        onDeleteLesson={handleDeleteLesson}
        lesson={selectedLesson}
      />
    </div>
  );
};

const AddLessonDialog = ({ isOpen, onClose, onAddLesson, courseId }) => {
  const [newLesson, setNewLesson] = useState({
    lesson_number: "",
    lesson_title: "",
    lesson_description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLesson({ ...newLesson, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAddLesson({ ...newLesson, courseId });
    setNewLesson({
      lesson_number: "",
      lesson_title: "",
      lesson_description: "",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lesson_number">Lesson Number</Label>
              <Input
                id="lesson_number"
                name="lesson_number"
                type="number"
                value={newLesson.lesson_number}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lesson_title">Lesson Title</Label>
              <Input
                id="lesson_title"
                name="lesson_title"
                value={newLesson.lesson_title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lesson_description">Lesson Description</Label>
              <Textarea
                id="lesson_description"
                name="lesson_description"
                value={newLesson.lesson_description}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add Lesson
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const EditLessonDialog = ({
  isOpen,
  onClose,
  onSaveLesson,
  lesson,
  courseId,
}) => {
  const [editedLesson, setEditedLesson] = useState({
    lesson_number: "",
    lesson_title: "",
    lesson_description: "",
    course_id: "",
  });

  useEffect(() => {
    if (lesson) {
      setEditedLesson({
        lesson_number: lesson.lesson_number || "",
        lesson_title: lesson.lesson_title || "",
        lesson_description: lesson.lesson_description || "",
        lesson_id: lesson.lesson_id,
        course_id: courseId,
      });
    }
  }, [lesson, courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLesson((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lesson && lesson.lesson_id) {
      await onSaveLesson(editedLesson);
      onClose();
    }
  };

  if (!lesson) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lesson_number">Lesson Number</Label>
              <Input
                id="lesson_number"
                name="lesson_number"
                type="number"
                value={editedLesson.lesson_number}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lesson_title">Lesson Title</Label>
              <Input
                id="lesson_title"
                name="lesson_title"
                value={editedLesson.lesson_title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="lesson_description">Lesson Description</Label>
              <Textarea
                id="lesson_description"
                name="lesson_description"
                value={editedLesson.lesson_description}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteLessonDialog = ({ isOpen, onClose, onDeleteLesson, lesson }) => {
  if (!lesson) return null;

  const handleDelete = async () => {
    await onDeleteLesson(lesson);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Lesson</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete the lesson "{lesson.lesson_title}"?
          This action cannot be undone.
        </DialogDescription>
        <DialogFooter className="mt-4">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CreateCourseModal = ({ isOpen, onClose, onCreateCourse }) => {
  const [step, setStep] = useState(1);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    content: "",
    price: "",
  });

  const resetModal = () => {
    setStep(1);
    setNewCourse({
      title: "",
      description: "",
      content: "",
      price: "",
    });
  };

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const handleNext = () => setStep(step + 1);
  const handlePrevious = () => setStep(step - 1);

  const handleCreate = async () => {
    await onCreateCourse(newCourse);
    onClose();
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setNewCourse({ ...newCourse, price: value });
    }
  };

  const calculateNetEarnings = (price) => {
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) return "0.00";
    return (numPrice * 0.9).toFixed(2);
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
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    placeholder="Price"
                    className="w-24"
                    value={newCourse.price}
                    onChange={handlePriceChange}
                  />
                </div>
                <div>
                  <Label htmlFor="netEarnings">Net Earnings</Label>
                  <Input
                    id="netEarnings"
                    className="w-24"
                    value={calculateNetEarnings(newCourse.price)}
                    readOnly
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Chalkboard deducts a 10% seller fee to support our platform.
              </p>
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

const ContentCard = ({
  content,
  isSelected,
  onClick,
  onSave,
  onDelete,
  onBack,
}) => {
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onSave(editedContent);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <Card className="w-full">
        <CardHeader
          onClick={onClick}
          className="cursor-pointer bg-indigo-600 text-white p-4 hover:bg-indigo-700"
        >
          <CardTitle>{editedContent.content_type.toUpperCase()}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {content.content_type === "video" && (
            <div className="flex flex-col items-center">
              {content.content_url && (
                <iframe
                  width="560"
                  height="315"
                  className="w-full max-w-md mx-auto"
                  src={content.content_url}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              )}
              <CardDescription className="text-gray-700 mt-2 text-center">
                {content.content_text}
              </CardDescription>
            </div>
          )}
          {content.content_type === "audio" && (
            <div>
              <audio controls className="w-full">
                <source src={content.content_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <CardDescription className="text-gray-700 mt-2 text-center">
                {content.content_text}
              </CardDescription>
            </div>
          )}
          {content.content_type === "text" && (
            <CardDescription className="text-gray-700 text-lg">
              {content.content_text}
            </CardDescription>
          )}
          {content.content_type === "picture" && (
            <div>
              <img src={content.content_url} alt="content" className="w-full" />
              <CardDescription className="text-gray-700 mt-2 text-center">
                {content.content_text}
              </CardDescription>
            </div>
          )}
          {isSelected && (
            <>
              <Label className="block text-gray-700 mt-4">Content Text</Label>
              <Textarea
                value={editedContent.content_text}
                onChange={(e) =>
                  setEditedContent({
                    ...editedContent,
                    content_text: e.target.value,
                  })
                }
                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
              />
              {["video", "audio", "picture"].includes(content.content_type) && (
                <>
                  <Label className="block text-gray-700 mt-4">
                    Content URL
                  </Label>
                  <Input
                    value={editedContent.content_url}
                    onChange={(e) =>
                      setEditedContent({
                        ...editedContent,
                        content_url: e.target.value,
                      })
                    }
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                  />
                </>
              )}
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={onBack}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Save
                </Button>
                <Button
                  onClick={() => onDelete(content.content_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const CreateContentDialog = ({ isOpen, onClose, onCreateContent }) => {
  const [newContent, setNewContent] = useState({
    content_type: "",
    content_url: "",
    content_text: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContent({ ...newContent, [name]: value });
  };

  const handleCreate = () => {
    onCreateContent(newContent);
    setNewContent({ content_type: "", content_url: "", content_text: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="content_type">Content Type</Label>
            <select
              id="content_type"
              name="content_type"
              value={newContent.content_type}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a type</option>
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="picture">Picture</option>
            </select>
          </div>
          {newContent.content_type !== "text" && (
            <div>
              <Label htmlFor="content_url">Content URL</Label>
              <Input
                id="content_url"
                name="content_url"
                value={newContent.content_url}
                onChange={handleInputChange}
                className="w-full mt-1"
              />
            </div>
          )}
          <div>
            <Label htmlFor="content_text">Content Text</Label>
            <Textarea
              id="content_text"
              name="content_text"
              value={newContent.content_text}
              onChange={handleInputChange}
              className="w-full mt-1"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Create Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ContentManagement = ({ lesson, onBack }) => {
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isCreateContentDialogOpen, setIsCreateContentDialogOpen] =
    useState(false);

  useEffect(() => {
    fetchContents();
  }, [lesson.lesson_id]);

  const fetchContents = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/instructor/course/lesson/contents?lessonId=${lesson.lesson_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contents");
      }

      const contentsData = await response.json();
      setContents(contentsData);
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  const handleCreateContent = async (newContent) => {
    try {
      const response = await fetch(
        `${API_URL}/api/instructor/course/lesson/content/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            lesson_id: lesson.lesson_id,
            ...newContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create content");
      }

      await fetchContents();
    } catch (error) {
      console.error("Error creating content:", error);
    }
  };

  const handleSaveContent = async (editedContent) => {
    try {
      const response = await fetch(
        `${API_URL}/api/instructor/course/lesson/content/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editedContent),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update content");
      }

      await fetchContents();
      setSelectedContent(null);
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/instructor/course/lesson/content/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            content_id: contentId,
            lesson_id: lesson.lesson_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete content");
      }

      await fetchContents();
      setSelectedContent(null);
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Lesson
      </Button>
      <h2 className="text-3xl font-bold">
        Manage Content for {lesson.lesson_title}
      </h2>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 gap-4">
          {contents.map((content) => (
            <ContentCard
              key={content.content_id}
              content={content}
              isSelected={
                selectedContent &&
                selectedContent.content_id === content.content_id
              }
              onClick={() => setSelectedContent(content)}
              onSave={handleSaveContent}
              onDelete={handleDeleteContent}
              onBack={() => setSelectedContent(null)}
            />
          ))}
          <Card className="w-full flex justify-center items-center bg-white shadow-md rounded-lg overflow-hidden">
            <CardContent className="p-4">
              <Button
                onClick={() => setIsCreateContentDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Content
              </Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
      <CreateContentDialog
        isOpen={isCreateContentDialogOpen}
        onClose={() => setIsCreateContentDialogOpen(false)}
        onCreateContent={handleCreateContent}
      />
    </div>
  );
};

const InstructorCenter = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("courses");
  const [earningsData, setEarningsData] = useState([]);
  const [earningsTimeframe, setEarningsTimeframe] = useState("1m");

  useEffect(() => {
    fetchCourses();
    if (activeTab === "earnings") {
      fetchEarningsData();
    }
  }, [activeTab, earningsTimeframe]);

  const fetchEarningsData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/instructor/earnings`, {
        credentials: "include",
      });
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
                className={`h-8 px-3 text-xs ${
                  earningsTimeframe.toUpperCase() === timeframe
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : ""
                }`}
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

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/api/instructor/courses`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const coursesData = await response.json();

      const coursesWithEnrollments = await Promise.all(
        coursesData.map(async (course) => {
          const enrollmentsResponse = await fetch(
            `${API_URL}/api/instructor/course/enrollments?courseId=${course.course_id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!enrollmentsResponse.ok) {
            throw new Error(
              `Failed to fetch enrollments for course ${course.course_id}`
            );
          }

          const enrollmentsData = await enrollmentsResponse.json();
          return { ...course, enrolled_students: enrollmentsData };
        })
      );

      setCourses(coursesWithEnrollments);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleCreateCourse = async (newCourse) => {
    try {
      const response = await fetch(`${API_URL}/api/instructor/courses/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          course_name: newCourse.title,
          course_description: newCourse.description,
          course_details: newCourse.content,
          course_price: parseFloat(newCourse.price),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      await fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleSaveCourse = async (editedCourse) => {
    try {
      const response = await fetch(`${API_URL}/api/instructor/courses/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          course_id: editedCourse.course_id,
          course_name: editedCourse.course_name,
          course_description: editedCourse.course_description,
          course_details: editedCourse.course_details,
          course_price: parseFloat(editedCourse.course_price),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update course");
      }

      const result = await response.json();

      if (result.success) {
        await fetchCourses();
        setSelectedCourse(null);
      } else {
        throw new Error(result.message || "Failed to update course");
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const renderCoursesTab = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Courses</h2>
        {!selectedCourse && (
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Create Course
          </Button>
        )}
      </div>
      {selectedCourse ? (
        <CourseDetails
          course={selectedCourse}
          onBack={() => setSelectedCourse(null)}
          onSave={handleSaveCourse}
        />
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={course.course_id}
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
