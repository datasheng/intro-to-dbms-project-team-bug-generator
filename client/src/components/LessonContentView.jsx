import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Loader2 } from "lucide-react";

const API_URL = "http://localhost:3000";

const ContentCard = ({ content }) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{content.content_type.toUpperCase()}</CardTitle>
    </CardHeader>
    <CardContent>
      {content.content_type === "video" && (
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={content.content_url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
      )}
      {content.content_type === "audio" && (
        <audio controls className="w-full">
          <source src={content.content_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      {content.content_type === "text" && (
        <p className="text-gray-700">{content.content_text}</p>
      )}
      {content.content_type === "picture" && (
        <img
          src={content.content_url}
          alt="Content"
          className="w-full h-auto"
        />
      )}
      {content.content_type !== "text" && (
        <CardDescription className="mt-2">
          {content.content_text}
        </CardDescription>
      )}
    </CardContent>
  </Card>
);

const LessonContentView = ({ lesson, onBack }) => {
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/api/student/course/lesson/contents?lessonId=${lesson.lesson_id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lesson contents");
        }

        const contentsData = await response.json();
        setContents(contentsData);
      } catch (error) {
        console.error("Error fetching lesson contents:", error);
        setError("Failed to load lesson contents. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContents();
  }, [lesson.lesson_id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={onBack} variant="ghost">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Course
      </Button>
      <h2 className="text-3xl font-bold">
        Lesson {lesson.lesson_number}: {lesson.lesson_title}
      </h2>
      <p className="text-gray-600">{lesson.lesson_description}</p>
      <ScrollArea className="h-[calc(100vh-250px)]">
        {contents.map((content) => (
          <ContentCard key={content.content_id} content={content} />
        ))}
      </ScrollArea>
    </div>
  );
};

export default LessonContentView;
