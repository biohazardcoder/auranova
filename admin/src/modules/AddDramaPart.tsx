import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import axios, { AxiosProgressEvent } from "axios";
import useSWR from "swr";
import { fetcher } from "@/middlewares/Fetcher";

export function AddDramaPart({ id }: { id: string }) {
  const [formData, setFormData] = useState({
    title: "",
    part: 0,
    season: 0,
  });
  const [videos, setVideos] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const { mutate } = useSWR(`/drama/${id}`, fetcher)

  const resetForm = () => {
    setFormData({ title: "", part: 0, season: 0 });
    setVideos(null);
    setErrors({});
    setUploadProgress(0);
    setUploadedSize(0);
    setTotalSize(0);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Drama nomi majburiy.";
    if (!formData.season) newErrors.season = "Mavsum majburiy.";
    if (!formData.part) newErrors.part = "Qism majburiy.";
    if (!videos || videos.length === 0) newErrors.videos = "Bitta video tanlang.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: id === "season" || id === "part" ? parseInt(value) : value });
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideos([file])
    }
  };

  const formatBytes = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const body = new FormData();
      body.append("drama", id);
      body.append("title", formData.title);
      body.append("season", formData.season.toString());
      body.append("part", formData.part.toString());

      if (videos && videos.length > 0) {
        body.append("video", videos[0]);
      }

      const totalBytes = Array.from(videos || []).reduce((acc, file) => acc + file.size, 0);
      setTotalSize(totalBytes);

      await axios.post("http://localhost:4000/api/drama/part", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const loaded = progressEvent.loaded;
          const percentCompleted = Math.round((loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
          setUploadedSize(loaded);
        },
      });
      await mutate()
      toast.success("Qism muvaffaqiyatli qo‘shildi!");
      resetForm();
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Qism qo‘shishda xatolik yuz berdi.");
      console.error(error);
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
        <Button variant="default" className="bg-sky-600">Qism qo‘shish</Button>
      </SheetTrigger>
      <SheetContent className="h-full w-full sm:max-w-md sm:h-auto bg-[#202020] text-white border-none">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">Yangi Qism</SheetTitle>
        </SheetHeader>
        <SheetDescription>Barcha maydonlarni to‘ldiring</SheetDescription>

        <div className="flex flex-col gap-4 py-4">
          {["title", "season", "part"].map((field) => (
            <div className="space-y-1" key={field}>
              <Label htmlFor={field}>
                {{
                  title: "Qism nomi *",
                  season: "Mavsum *",
                  part: "Qism *",
                }[field]}
              </Label>
              <Input
                id={field}
                type={["season", "part"].includes(field) ? "number" : "text"}
                value={(formData as any)[field]}
                onChange={handleInputChange}
                className={errors[field] ? "border-red-500" : ""}
              />
              {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
            </div>
          ))}

          <div className="space-y-1">
            <Label htmlFor="videos">Video *</Label>
            <Input
              id="videos"
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className={errors.videos ? "border-red-500" : ""}
            />
            {errors.videos && (
              <span className="text-red-500 text-sm">{errors.videos}</span>
            )}
          </div>


          {isLoading && (
            <div className="space-y-1">
              <Label className="text-white">
                Yuklanmoqda: {uploadProgress}% ({formatBytes(uploadedSize)} / {formatBytes(totalSize)})
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
            {isLoading ? "Yuklanmoqda..." : "Yaratish"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
