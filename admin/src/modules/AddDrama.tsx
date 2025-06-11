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
import { Fetch } from "@/middlewares/Fetch";
import useSWR from "swr";
import { fetcher } from "@/middlewares/Fetcher";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimeCategories, categoryProps } from "@/types/AnimeCategories";

export function AddDrama() {
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
  const { mutate } = useSWR("/drama", fetcher)
  const resetForm = () => {
    setFormData({ title: "", description: "", category: "", made: "", country: "", studio: "" });
    setImages(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Drama nomi majburiy.";
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

      await Fetch.post("/drama/create", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await mutate()
      toast.success("Drama muvaffaqiyatli qo‘shildi!");

      resetForm();
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Drama qo‘shishda xatolik yuz berdi.");
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
        <Button variant="default" className="bg-sky-600">Drama qo‘shish</Button>
      </SheetTrigger>
      <SheetContent className="h-full w-full sm:max-w-md sm:h-auto bg-[#202020] text-white border-none">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">Yangi Drama</SheetTitle>
        </SheetHeader>
        <SheetDescription>Barcha maydonlarni to‘ldiring</SheetDescription>

        <div className="flex flex-col gap-4 py-4">
          {["title", "description", "country", "studio", "made"].map((field) => (
            <div className="space-y-1" key={field}>
              <Label htmlFor={field}>
                {{
                  title: "Drama nomi *",
                  description: "Tavsif *",
                  country: "Mamlakat",
                  studio: "Studiya",
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
