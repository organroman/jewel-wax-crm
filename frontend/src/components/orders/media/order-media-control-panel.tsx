import { OrderMedia } from "@/types/order.types";

import { useTranslation } from "react-i18next";
import { ExternalLinkIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface OrderMediaControlPanelProps {
  previews: OrderMedia[];
  currentIdx: number;
  handleSwitchIsMain: (type: "other" | "image") => void;
  handleDeleteImage: (type: "other" | "image") => void;
  handleFileChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
  type: "other" | "image";
}

const OrderMediaControlPanel = ({
  previews,
  currentIdx,
  handleSwitchIsMain,
  handleDeleteImage,
  handleFileChange,
  type,
}: OrderMediaControlPanelProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex mt-auto items-center justify-center gap-4 shrink-0">
      <div className="flex items-center gap-2.5">
        <Switch
          checked={previews[currentIdx]?.is_main}
          onCheckedChange={() => handleSwitchIsMain(type)}
        />
        <Label>
          {type === "image" ? t("order.labels.main_photo") : t("labels.main")}
        </Label>
      </div>
      <a
        href={previews?.[currentIdx]?.url ?? previews?.[0]?.url}
        target="_blank"
      >
        <ExternalLinkIcon className="size-4 text-action-plus" />
      </a>
      <Button
        type="button"
        variant="ghostDestructive"
        size="icon"
        onClick={() => handleDeleteImage(type)}
      >
        <Trash2Icon className="size-4" />
      </Button>
      <label className="cursor-pointer text-sm font-medium text-action-plus hover:underline hover:underline-offset-4">
        <input
          type="file"
          hidden
          multiple
          accept={type === "image" ? "image/*" : "*"}
          onChange={(e) => handleFileChange(e, type)}
        />
        {t("buttons.add")}
      </label>
    </div>
  );
};

export default OrderMediaControlPanel;
