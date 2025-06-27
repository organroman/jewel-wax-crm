import { OrderMedia } from "@/types/order.types";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2Icon } from "lucide-react";

import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface OrderImagesProps {
  previews: OrderMedia[];
  setPreviews: Dispatch<SetStateAction<OrderMedia[]>>;
  newFiles: File[];
  setNewFiles: Dispatch<SetStateAction<File[]>>;
  currentMedia: OrderMedia[];
  handleUpdateMedia: (media: OrderMedia[]) => void;
}

const OrderImages = ({
  setNewFiles,
  setPreviews,
  previews = [],
  currentMedia,
  handleUpdateMedia,
}: OrderImagesProps) => {
  const { t } = useTranslation();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );

    const newImages = files.filter(
      (file) =>
        !previews.some((p) => p.name === file.name && p.type === "image")
    );

    if (newImages.length) {
      setNewFiles((prev) => [...prev, ...newImages]);
      setPreviews((prev) => [
        ...prev,
        ...newImages.map((f) => ({
          type: "image",
          url: URL.createObjectURL(f),
          name: f.name,
          is_main: false,
        })),
      ]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => ({
        type: "image",
        url: URL.createObjectURL(f),
        name: f.name,
        is_main: false,
      })),
    ]);
  };

  const handleSwitchIsMain = () => {
    const current = previews?.[currentIdx];

    if (current?.id) {
      const updated = currentMedia.map((img) => ({
        ...img,
        is_main: img.id === current.id,
      }));

      handleUpdateMedia(updated);

      setPreviews((prev) =>
        prev.map((img) => ({
          ...img,
          is_main: img.id === current.id,
        }))
      );
    } else {
      setPreviews((prev) =>
        prev.map((img) => ({
          ...img,
          is_main: img.url === current?.url,
        }))
      );
    }
  };

  const handleDeleteImage = () => {
    const current = previews?.[currentIdx];

    if (!current) return;

    if (current?.id) {
      const updated = currentMedia.filter((media) => media.id !== current.id);
      handleUpdateMedia(updated);
      setPreviews((prev) => [...prev.filter((img) => !img.id), ...updated]);
    } else {
      setPreviews((prev) => prev.filter((img) => img.url !== current.url));
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];

      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (
            file &&
            !previews.some((p) => p.name === file.name && p.type === "image")
          ) {
            files.push(file);
          }
        }
      }

      if (files.length) {
        setNewFiles((prev) => [...prev, ...files]);
        setPreviews((prev) => [
          ...prev,
          ...files.map((f) => ({
            type: "image",
            url: URL.createObjectURL(f),
            name: f.name,
            is_main: false,
          })),
        ]);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [previews]);

  return (
    <div className="flex flex-col overflow-hidden shrink-0">
      <div
        className={`w-full flex flex-col`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-primary/30 z-10 rounded-md pointer-events-none" />
        )}
        <div
          className={`w-full h-60 p-2.5 bg-ui-column rounded-md flex justify-center flex-col ${
            isDragging ? " border-2 border-dashed border-brand-dark" : ""
          } `}
        >
          {!previews?.length && (
            <label className="w-full h-full aspect-square border-dashed border flex items-center justify-center cursor-pointer text-action-plus hover:underline hover:underline-offset-4">
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
              + {t("buttons.add")}
            </label>
          )}
          <div className="w-full flex-1 overflow-hidden flex items-center justify-center">
            <a
              href={previews?.[currentIdx]?.url}
              target="_blank"
              className="h-full aspect-auto rounded-t-md self-center"
            >
              <img
                src={previews?.[currentIdx]?.url}
                alt=""
                className="h-full aspect-auto rounded-t-md self-center"
              />
            </a>
          </div>
          {!!previews?.length && (
            <div className="flex mt-auto items-center justify-center gap-5 shrink-0">
              <div className="flex items-center gap-2.5">
                <Switch
                  checked={previews[currentIdx]?.is_main}
                  onCheckedChange={handleSwitchIsMain}
                />
                <Label>{t("order.labels.main_photo")}</Label>
              </div>
              <Button
                type="button"
                variant="ghostDestructive"
                size="icon"
                onClick={handleDeleteImage}
              >
                <Trash2Icon className="size-4" />
              </Button>
              <label className="cursor-pointer text-sm font-medium text-action-plus hover:underline hover:underline-offset-4">
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {t("buttons.add")}
              </label>
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-row w-full gap-2.5 overflow-x-scroll">
        {previews?.map((image, index) => (
          <div
            key={image?.url}
            className="h-16 p-1 rounded-md w-28 shrink-0 bg-ui-column flex items-center justify-center"
            onClick={() => setCurrentIdx(index)}
          >
            <img
              src={image?.url}
              className="h-full aspect-auto rounded-md "
              alt={`image`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderImages;
