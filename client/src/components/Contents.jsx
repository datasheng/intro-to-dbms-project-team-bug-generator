import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockContents = [
    {
        content_id: 1,
        lesson_id: 1,
        content_type: "video",
        content_url: "https://www.youtube.com/embed/8UVNT4wvIGY?si=b1cku_EFM-XQIK1e",
        content_text: "Introduction to React",
    },
    {
        content_id: 2,
        lesson_id: 1,
        content_type: "text",
        content_url: "",
        content_text: "Learn the basics of React and build your first app.",
    },
    {
        content_id: 3,
        lesson_id: 2,
        content_type: "video",
        content_url: "https://www.youtube.com/embed/EkHTsc9PU2A?si=33H_ryi0kD2y2uB2",
        content_text: "Components in React",
    },
    {
        content_id: 4,
        lesson_id: 2,
        content_type: "audio",
        content_url: "",
        content_text: "Understand the concept of components and how to create them.",
    },
    {
        content_id: 6,
        lesson_id: 3,
        content_type: "text",
        content_url: "",
        content_text: "Learn how to manage state and props in React.",
    },
    {
        content_id: 7,
        lesson_id: 3,
        content_type: "picture",
        content_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcR5U16C8yXgBpl7-Bc7Itjx3_LRl425zINA&s",
        content_text: "Learn how to manage state and props in React.",
    },
];

const ContentCard = ({ content }) => {
    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-4">
            <Card className="w-full">
                <CardHeader className="bg-indigo-600 text-white p-4">
                    <CardTitle>{content.content_type.toUpperCase()}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {content.content_type === 'video' && (
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
                            <CardDescription className="text-gray-700 mt-2 text-center">{content.content_text}</CardDescription>
                        </div>
                    )}
                    {content.content_type === 'audio' && (
                        <div>
                            <audio controls className="w-full">
                                <source src={content.content_url} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            <CardDescription className="text-gray-700 mt-2 text-center">{content.content_text}</CardDescription>
                        </div>
                    )}
                    {content.content_type === 'text' && (
                        <CardDescription className="text-gray-700 text-lg">{content.content_text}</CardDescription>
                    )}
                    {content.content_type === 'picture' && (
                        <div>
                            <img src={content.content_url} alt="content" className="w-full" />
                            <CardDescription className="text-gray-700 mt-2 text-center">{content.content_text}</CardDescription>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const LessonPage = () => {
    const [contents] = useState(mockContents);

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-indigo-700 mb-6">
                Online Lectures
            </h1>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 gap-4">
                    {contents.map((content) => (
                        <ContentCard
                            key={content.content_id}
                            content={content}
                        />
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default LessonPage;