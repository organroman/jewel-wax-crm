import { OrderMediaFilesProps } from "@/types/order.types";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import OrderImagesPreview from "./order-images-preview";
import OrderMediaControlPanel from "./order-media-control-panel";
import OrderImageView from "./order-image-view";
import OrderFileView from "./order-file-view";
import OrderFilesPreview from "./order-files-preview";

import { Separator } from "@/components/ui/separator";

const OrderMediaComponent = ({
  setNewFiles,
  setPreviews,
  previews = [],
  currentMedia,
  handleUpdateMedia,
  hasExtraAccess = () => true,
}: OrderMediaFilesProps) => {
  const { t } = useTranslation();
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [currentFileIdx, setCurrentFileIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const imagesPreviews = previews.filter((file) => file.type === "image");
  const otherPreviews = previews.filter((file) => file.type === "other");

  const canUpdateMedia = hasExtraAccess("UPDATE", "media");
  const canCreateMedia = hasExtraAccess("CREATE", "media");
  const canDeleteMedia = hasExtraAccess("DELETE", "media");

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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setNewFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [
      ...prev,
      ...files.map((f) => ({
        type: type,
        url: URL.createObjectURL(f),
        name: f.name,
        is_main: false,
      })),
    ]);
  };

  const handleSwitchIsMain = (type: "image" | "other") => {
    const current =
      type === "image"
        ? imagesPreviews[currentImageIdx]
        : otherPreviews[currentFileIdx];

    if (current?.id) {
      const updated = currentMedia.map((media) => ({
        ...media,
        is_main: media.id === current.id,
      }));

      handleUpdateMedia(updated);

      setPreviews((prev) =>
        prev.map((media) => ({
          ...media,
          is_main: media.id === current.id,
        }))
      );
    } else {
      setPreviews((prev) =>
        prev.map((media) => ({
          ...media,
          is_main: media.url === current?.url,
        }))
      );
    }
  };

  const handleDeleteImage = (type: "image" | "other") => {
    const current =
      type === "image"
        ? imagesPreviews[currentImageIdx]
        : otherPreviews[currentFileIdx];

    if (!current) return;

    if (current?.id) {
      const updated = currentMedia.filter((media) => media.id !== current.id);
      handleUpdateMedia(updated);
      setPreviews((prev) => [...prev.filter((media) => !media.id), ...updated]);
    } else {
      setPreviews((prev) => prev.filter((media) => media.url !== current.url));
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
      previews.forEach((p) => {
        if (p.url?.startsWith("blob:")) {
          URL.revokeObjectURL(p.url);
        }
      });

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
    <div className="flex flex-col gap-5">
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
              isDragging ? " border-2 border-dashed border-text-regular" : ""
            } `}
          >
            {!previews?.length && (
              <label className="w-full h-full aspect-square border-dashed border flex items-center justify-center cursor-pointer text-action-plus hover:underline hover:underline-offset-4">
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "image")}
                />
                + {t("buttons.add")}
              </label>
            )}
            <OrderImageView
              previews={imagesPreviews}
              currentIdx={currentImageIdx}
            />
            {!!imagesPreviews?.length && (
              <OrderMediaControlPanel
                previews={imagesPreviews}
                currentIdx={currentImageIdx}
                handleSwitchIsMain={handleSwitchIsMain}
                handleDeleteImage={handleDeleteImage}
                handleFileChange={handleFileChange}
                type="image"
                canDeleteMedia={canDeleteMedia}
                canCreateMedia={canCreateMedia}
                canUpdateMedia={canUpdateMedia}
              />
            )}
          </div>
        </div>
        <OrderImagesPreview
          previews={imagesPreviews}
          setCurrentIdx={setCurrentImageIdx}
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <div>
          <p className="font-medium text-text-regular mb-2.5">
            {t("order.labels.files")}
          </p>
          <Separator className="bg-ui-border h-[1px] data-[orientation=horizontal]:h-[1px0]" />
        </div>
        <div className="flex flex-col overflow-hidden shrink-0">
          <div className="w-full h-30 p-2.5 border border-ui-border rounded-md flex items-center justify-center flex-col">
            {!otherPreviews?.length && (
              <label className="flex items-center cursor-pointer text-action-plus hover:underline hover:underline-offset-4">
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => handleFileChange(e, "other")}
                />
                + {t("buttons.add")}
              </label>
            )}

            {!!otherPreviews?.length && (
              <div className="flex flex-col">
                <OrderFileView
                  currentIdx={currentFileIdx}
                  previews={otherPreviews}
                />
                <OrderMediaControlPanel
                  previews={otherPreviews}
                  currentIdx={currentFileIdx}
                  handleSwitchIsMain={handleSwitchIsMain}
                  handleDeleteImage={handleDeleteImage}
                  handleFileChange={handleFileChange}
                  type="other"
                  canDeleteMedia={canDeleteMedia}
                  canCreateMedia={canCreateMedia}
                  canUpdateMedia={canUpdateMedia}
                />
              </div>
            )}
          </div>
          <OrderFilesPreview
            currentIdx={currentFileIdx}
            setCurrentIdx={setCurrentFileIdx}
            previews={otherPreviews}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderMediaComponent;
