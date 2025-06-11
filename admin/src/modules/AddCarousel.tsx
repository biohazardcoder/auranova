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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddCarousel() {
  const [formData, setFormData] = useState({
    url: "",
    type: ""
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { mutate } = useSWR("/carousel", fetcher)
  const resetForm = () => {
    setFormData({ url: "", type: "" });
    setImages(null);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.url.trim()) newErrors.made = "Havola majburiy.";
    if (!formData.type.trim()) newErrors.made = "Turini kiritish majburiy.";
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
      body.append("url", formData.url);
      body.append("type", formData.type);

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          body.append("images", images[i]);
        }
      }

      await Fetch.post("/carousel/create", body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await mutate()
      toast.success("Karusel muvaffaqiyatli qo‘shildi!");

      resetForm();
      setIsSheetOpen(false);
    } catch (error) {
      toast.error("Karusel qo‘shishda xatolik yuz berdi.");
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
        <Button variant="default" className="bg-sky-600">Karusel qo‘shish</Button>
      </SheetTrigger>
      <SheetContent className="h-full w-full sm:max-w-md sm:h-auto bg-[#202020] text-white border-none">
        <SheetHeader>
          <SheetTitle className="text-white text-2xl">Yangi Karusel</SheetTitle>
        </SheetHeader>
        <SheetDescription>Barcha maydonlarni to‘ldiring</SheetDescription>
        <div className="flex flex-col gap-4 py-4">
          {["url", "type"].map((field) => (
            <div className="space-y-1" key={field}>
              <Label htmlFor={field}>
                {{
                  url: "Havola (ID) *",
                  type: "Turi *",
                }[field]}
              </Label>

              {field === "type" ? (
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                  value={(formData as any)[field]}
                >
                  <SelectTrigger className={`w-full ${errors[field] ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Turini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                    <SelectItem value="movie">Film</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={field}
                  value={(formData as any)[field]}
                  onChange={handleInputChange}
                  className={errors[field] ? "border-red-500" : ""}
                />
              )}

              {errors[field] && <span className="text-red-500 text-sm">{errors[field]}</span>}
            </div>
          ))}

          <div className="space-y-1">
            <Label htmlFor="images">Orqa fon *</Label>
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
