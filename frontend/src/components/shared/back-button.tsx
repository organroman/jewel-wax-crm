import { ChevronLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";

const BackButton = () => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant="link"
      className="w-fit has-[>svg]:p-0 text-text-light h-4 mb-5"
    >
      <ChevronLeftIcon /> {t("buttons.back_to_table")}
    </Button>
  );
};

export default BackButton;
