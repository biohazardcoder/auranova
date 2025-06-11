"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetDescription,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import useSWR from "swr";
import { fetcher } from "@/middlewares/Fetcher";

interface AddVideoProps {
    id: string;
}

export function AddVideo({ id }: AddVideoProps) {
    const [video, setVideo] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { mutate } = useSWR(`/movie/${id}`, fetcher)

    const resetForm = () => {
        setVideo(null);
        setError(null);
        setIsLoading(false);
        setUploadProgress(0);
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setVideo(e.target.files[0]);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!video) {
            setError("Iltimos, video fayl tanlang.");
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("video", video);

            await axios.post(
                `http://localhost:4000/api/movie/${id}/video`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / (progressEvent.total || 1)
                        );
                        setUploadProgress(percentCompleted);
                    },
                }
            );

            toast.success("Video muvaffaqiyatli yuklandi!");
            await mutate()
            resetForm();
            setIsSheetOpen(false);
        } catch (err) {
            console.error(err);
            setError("Video yuklashda xatolik yuz berdi.");
            toast.error("Video yuklashda xatolik yuz berdi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Sheet
            open={isSheetOpen}
            onOpenChange={(open) => {
                setIsSheetOpen(open);
                if (!open) resetForm();
            }}
        >
            <SheetTrigger asChild>
                <Button variant="default" className="bg-sky-600">
                    Videoni qo‘shish
                </Button>
            </SheetTrigger>

            <SheetContent className="h-full w-full sm:max-w-md sm:h-auto bg-[#202020] text-white border-none">
                <SheetHeader>
                    <SheetTitle className="text-white text-2xl">Video yuklash</SheetTitle>
                </SheetHeader>

                <SheetDescription>Iltimos, video fayl tanlab yuklang</SheetDescription>

                <div className="flex flex-col gap-4 py-4">
                    <div className="space-y-1">
                        <Label htmlFor="video">Video fayl *</Label>
                        <Input
                            id="video"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoChange}
                            className={error ? "border-red-500" : ""}
                            disabled={isLoading}
                        />
                        {error && <span className="text-red-500 text-sm">{error}</span>}
                    </div>

                    {isLoading && (
                        <div className="space-y-1">
                            <Label className="text-white">
                                Yuklanmoqda: {uploadProgress}%
                            </Label>
                            <Progress value={uploadProgress} className="h-2 bg-secondary" />
                        </div>
                    )}
                </div>

                <SheetFooter>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? "Yuklanmoqda..." : "Yuklash"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
