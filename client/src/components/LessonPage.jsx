import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// 모의 데이터 정의
const mockLessons = [
    {
        id: 1,
        title: "Lesson 1",
        description: "Learn the basics of React and build your first app.",
        course_id: 1,
    },
    {
        id: 2,
        title: "Lesson 2",
        description: "Understand the concept of components and how to create them.",
        course_id: 1,
    },
    {
        id: 3,
        title: "Lesson 3",
        description: "Learn how to manage state and props in React.",
        course_id: 1,
    },
];

// LessonPage 컴포넌트 정의
const LessonPage = () => {
    const [lessons, setLessons] = useState(mockLessons);
    const [selectedLesson, setSelectedLesson] = useState(null);

    // 새로운 레슨 생성 핸들러
    const handleCreateLesson = () => {
        const newLesson = {
            id: lessons.length + 1,
            title: "Lesson",
            description: "",
            course_id: 1,
        };
        setLessons([...lessons, newLesson]);
        setSelectedLesson(newLesson);
    };

    // 레슨 저장 핸들러
    const handleSaveLesson = (editedLesson) => {
        setLessons(
            lessons.map((lesson) =>
                lesson.id === editedLesson.id ? editedLesson : lesson
            )
        );
        setSelectedLesson(null);
    };

    // 레슨 삭제 핸들러
    const handleDeleteLesson = (lessonId) => {
        setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
        setSelectedLesson(null);
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-indigo-700 mb-6">
                    Manage Lessons
                </h1>
                <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={handleCreateLesson}
                >
                    <Plus className="mr-2 h-4 w-4" /> Create Lesson
                </Button>
            </div>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 gap-4">
                    {lessons.map((lesson) => (
                        <LessonCard
                            key={lesson.id}
                            lesson={lesson}
                            isSelected={selectedLesson && selectedLesson.id === lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            onSave={handleSaveLesson}
                            onDelete={handleDeleteLesson}
                            onBack={() => setSelectedLesson(null)}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

// LessonCard 컴포넌트 정의
const LessonCard = ({ lesson, isSelected, onClick, onSave, onDelete, onBack }) => {
    const [editedLesson, setEditedLesson] = useState(lesson);

    const handleSave = () => {
        onSave(editedLesson);
    };

    return (
        <Card className="w-full">
            <CardHeader onClick={onClick}>
                <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{lesson.description || "No description yet"}</CardDescription>
                {isSelected && (
                    <>
                        <Label>Lesson Title</Label>
                        <Input
                            value={editedLesson.title}
                            onChange={(e) => setEditedLesson({ ...editedLesson, title: e.target.value })}
                        />
                        <Label>Lesson Description</Label>
                        <Textarea
                            value={editedLesson.description}
                            onChange={(e) => setEditedLesson({ ...editedLesson, description: e.target.value })}
                        />
                        <Button onClick={onBack}>close</Button>
                        <Button onClick={handleSave}>Save</Button>
                        <Button onClick={() => onDelete(lesson.id)}>Delete</Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default LessonPage;
