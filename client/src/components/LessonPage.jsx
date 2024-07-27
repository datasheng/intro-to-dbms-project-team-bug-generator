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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


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

const ContentCard = ({ content, isSelected, onClick, onSave, onDelete, onBack }) => {
    const [editedContent, setEditedContent] = useState(content);

    const handleSave = () => {
        onSave(editedContent);
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <Card className="w-full">
                <CardHeader onClick={onClick} className="cursor-pointer bg-indigo-600 text-white p-4 hover:bg-indigo-700">
                    <CardTitle>{editedContent.content_type.toUpperCase()}</CardTitle>
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
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerpolicy="strict-origin-when-cross-origin"
                                    allowfullscreen
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
                    {isSelected && (
                        <>
                            <Label className="block text-gray-700 mt-4">Content Text</Label>
                            <Textarea
                                value={editedContent.content_text}
                                onChange={(e) => setEditedContent({ ...editedContent, content_text: e.target.value })}
                                className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                            />
                            {['video', 'audio', 'picture'].includes(content.content_type) && (
                                <>
                                    <Label className="block text-gray-700 mt-4">Content URL</Label>
                                    <Input
                                        value={editedContent.content_url}
                                        onChange={(e) => setEditedContent({ ...editedContent, content_url: e.target.value })}
                                        className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                                    />
                                </>
                            )}
                            <div className="flex space-x-2 mt-4">
                                <Button onClick={onBack} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400">Close</Button>
                                <Button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">Save</Button>
                                <Button onClick={() => onDelete(content.content_id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Delete</Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const LessonPage = () => {
    const [contents, setContents] = useState(mockContents);
    const [selectedContent, setSelectedContent] = useState(null);

    const handleCreateContent = (contentType) => {
        const newContent = {
            content_id: contents.length + 1,
            lesson_id: 1, // Adjust this to link to the appropriate lesson
            content_type: contentType,
            content_url: contentType === 'text' ? '' : 'https://example.com/new-content-url',
            content_text: '',
        };
        setContents([...contents, newContent]);
        setSelectedContent(newContent);
    };

    const handleSaveContent = (editedContent) => {
        setContents(
            contents.map((content) =>
                content.content_id === editedContent.content_id ? editedContent : content
            )
        );
        setSelectedContent(null);
    };

    const handleDeleteContent = (contentId) => {
        setContents(contents.filter((content) => content.content_id !== contentId));
        setSelectedContent(null);
    };

    const handleBack = () => {
        setSelectedContent(null);
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-indigo-700 mb-6">
                    Manage Content
                </h1>
            </div>
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 gap-4">
                    {contents.map((content) => (
                        <ContentCard
                            key={content.content_id}
                            content={content}
                            isSelected={selectedContent && selectedContent.content_id === content.content_id}
                            onClick={() => setSelectedContent(content)}
                            onSave={handleSaveContent}
                            onDelete={handleDeleteContent}
                            onBack={handleBack}
                        />
                    ))}
                    <Card className="w-full flex justify-center items-center bg-white shadow-md rounded-lg overflow-hidden">
                        <CardContent className="p-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Button variant="outline" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white shadow-md rounded-lg overflow-hidden">
                                    <DropdownMenuLabel className="p-2 text-gray-700">Choose Type of content to create</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="border-t border-gray-200" />
                                    <DropdownMenuItem onClick={() => handleCreateContent('text')} className="p-2 hover:bg-gray-100 cursor-pointer">Text</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCreateContent('video')} className="p-2 hover:bg-gray-100 cursor-pointer">Video</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCreateContent('audio')} className="p-2 hover:bg-gray-100 cursor-pointer">Audio</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleCreateContent('picture')} className="p-2 hover:bg-gray-100 cursor-pointer">Picture</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
};

export default LessonPage;