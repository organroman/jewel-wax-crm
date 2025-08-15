import { Person } from "@/types/person.types";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Loader, Trash2Icon } from "lucide-react";

import { usePerson } from "@/api/person/use-person";
import { useUpload } from "@/api/upload/use-upload";

import { Button } from "@/components/ui/button";
import CustomAvatar from "../custom-avatar";

import { getInitials } from "@/lib/utils";

interface ProfileAvatarProps {
  person: Person;
}
const ProfileAvatar = ({ person }: ProfileAvatarProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { updateUserMutation } = usePerson.updateUser({
    queryClient,
    t,
  });
  const { uploadImagesMutation } = useUpload.uploadImages();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      uploadImagesMutation.mutate([file], {
        onSuccess: (data) => {
          const newMedia = data.map((media) => ({
            url: media.url,
          }));

          const { messengers, ...rest } = person;

          updateUserMutation.mutate({
            id: rest.id,
            first_name: rest.first_name,
            last_name: rest.last_name,
            patronymic: rest.patronymic,
            avatar_url: newMedia[0].url,
          });
        },
      });
    }
  };

  const handleDeleteImage = () => {
    const { ...rest } = person;
    updateUserMutation.mutate({
      id: rest.id,
      first_name: rest.first_name,
      last_name: rest.last_name,
      patronymic: rest.patronymic,
      avatar_url: null,
    });
  };

  const isLoading =
    updateUserMutation.isPending || uploadImagesMutation.isPending;
    
  return (
    <div className="flex flex-col items-center">
      <CustomAvatar
        className="w-[150px] h-[150px]"
        avatarUrl={person?.avatar_url ?? null}
        fallback={
          person ? getInitials(person?.last_name, person?.first_name) : ""
        }
        fallbackClassName="text-6xl"
      />
      <div className="flex flex-row gap-2.5 mt-7 items-center">
        <label className="cursor-pointer block text-xs underline underline-offset-4 text-action-plus">
          <input
            type="file"
            hidden
            accept={"image"}
            onChange={(e) => handleFileChange(e)}
            disabled={isLoading}
          />
          {isLoading ? (
            <Loader className="size-4 text-brand-default animate-spin" />
          ) : person.avatar_url ? (
            t("person.buttons.change_avatar")
          ) : (
            t("person.buttons.add_avatar")
          )}
        </label>
        <Button
          type="button"
          variant="ghostDestructive"
          size="sm"
          className="p-0"
          onClick={() => handleDeleteImage()}
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProfileAvatar;
