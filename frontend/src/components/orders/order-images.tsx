import { OrderMedia } from "@/types/order.types";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2Icon } from "lucide-react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
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
  const [api, setApi] = useState<CarouselApi>();
  const [currentIdx, setCurrentIdx] = useState(0);

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

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrentIdx(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentIdx(api.selectedScrollSnap());
    });
  }, [api]);

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

  return (
    <div className="w-full flex flex-col">
      <div className="w-full h-60 p-2.5 bg-ui-column rounded-md flex justify-center flex-col overflow-hidden">
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
      <div className="w-full mt-5 flex justify-center">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
        >
          <CarouselContent className="flex items-center gap-2.5 -ml-0">
            {previews?.map((image, index) => (
              <CarouselItem
                key={image?.url}
                className="h-16 p-1 rounded-md basis-1/4 bg-ui-column flex items-center justify-center"
                onClick={() => setCurrentIdx(index)}
              >
                <img
                  src={image?.url}
                  className="h-full aspect-auto rounded-md "
                  alt={`image`}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious type="button" />
          <CarouselNext type="button" /> */}
        </Carousel>
      </div>
    </div>
  );
};

export default OrderImages;
