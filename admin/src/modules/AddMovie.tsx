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
import useSWR from "swr";
import { fetcher } from "@/middlewares/Fetcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimeCategories, categoryProps } from "@/types/AnimeCategories";
import axios from "axios";
import { Progress } from "@/components/ui/progress";

export function AddMovie() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    made: "",
    studio: "",
    country: ""
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { mutate } = useSWR("/movie", fetcher);

  const resetForm = () => {
    setFormData({ title: "", description: "", category: "", made: "", country: "", studio: "" });
    setImages(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Film nomi majburiy.";
    if (!formData.description.trim()) newErrors.description = "Tavsif majburiy.";
    if (!formData.category.trim()) newErrors.category = "Kategoriya majburiy.";
    if (!formData.made.trim()) newErrors.made = "Yaratilgan yil majburiy.";
    if (!formData.studio.trim()) newErrors.made = "Studiya majburiy.";
    if (!formData.country.trim()) newErrors.made = "Mamlakat majburiy.";
    if (!images || images.length === 0) newErrors.images = "Kamida bitta rasm tanlang.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedSize, setUploadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const body = new FormData();
      body.append("title", formData.title);
      body.append("description", formData.description);
      body.append("category", formData.category);
      body.append("made", formData.made);
      body.append("country", formData.country);
      body.append("studio", formData.studio);

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          body.append("images", images[i]);
        }
      }

      const totalBytes = Array.from(images || []).reduce((acc, file) => acc + file.size, 0);
      setTotalSize(totalBytes);

      await axios.post("http://localhost:4000/api/movie/create", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const loaded = progressEvent.loaded;
          const percentCompleted = Math.round((loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
          setUploadedSize(loaded);
        }
      });

      await mutate();
      toast.success("Film muvaffaqiyatli qo‘shildi!");
      resetForm();
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Film qo‘shishda xatolik yuz berdi.");
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
        <Button variant="default" className="bg-sky-600">Film qo‘shish</Button>
      </SheetTrigger>
      <SheetContent className="h-full w-full sm:max-w-md sm:h-auto bg-[#202020] text-white border-none">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">Yangi Film</SheetTitle>
        </SheetHeader>
        <SheetDescription>Barcha maydonlarni to‘ldiring</SheetDescription>

        <div className="flex flex-col gap-2 py-4">
          {["title", "description", "country", "studio", "made"].map((field) => (
            <div className="space-y-1" key={field}>
              <Label htmlFor={field}>
                {{
                  title: "Film nomi *",
                  description: "Tavsif *",
                  country: "Mamlakat *",
                  studio: "Studiya *",
                  made: "Yaratilgan yili *",
                }[field]}
              </Label>
              <Input
                id={field}
                value={(formData as any)[field]}
                onChange={handleInputChange}
                className={errors[field] ? "border-red-500" : ""}
              />
              {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
            </div>
          ))}
          <div>
            <Label htmlFor="category">Kategoriya *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className={`w-full ${errors.category ? "border-red-500" : ""}`}>
                <SelectValue placeholder="Kategoriyalar" />
              </SelectTrigger>
              <SelectContent>
                {AnimeCategories.map(({ value }: categoryProps) => (
                  <SelectItem value={value} key={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="images">Rasmlar *</Label>
            <Input
              id="images"
              type="file"
              multiple
              onChange={handleImageChange}
              className={errors.images ? "border-red-500" : ""}
            />
            {errors.images && (
              <span className="text-red-500 text-sm">{errors.images}</span>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="space-y-1">
            <Label className="text-white">
              Yuklanmoqda: {uploadProgress}% ({(uploadedSize / (1024 * 1024)).toFixed(2)} MB / {(totalSize / (1024 * 1024)).toFixed(2)} MB)
            </Label>
            <Progress value={uploadProgress} className="h-2 bg-secondary" />
          </div>
        )}

        <SheetFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Yaratilmoqda..." : "Yaratish"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
