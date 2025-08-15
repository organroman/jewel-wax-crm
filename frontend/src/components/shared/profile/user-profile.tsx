"use client";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { CircleUserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { UseAuth } from "@/api/auth/use-auth";
import { usePerson } from "@/api/person/use-person";
import { useDialog } from "@/hooks/use-dialog";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";

import CustomAvatar from "../custom-avatar";
import InfoLabel from "../typography/info-label";
import ProfileInfo from "./profile-info";

import { getFullName, getInitials } from "@/lib/utils";

const UserProfile = ({ userId }: { userId: number }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: person } = usePerson.getPersonById({
    id: userId,
    enabled: Boolean(userId),
  });

  const { dialogOpen, setDialogOpen } = useDialog();

  const token = Cookies.get("token");

  if (!token) {
    router.replace("/login");
    return;
  }

  const logoutMutation = UseAuth.logout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        Cookies.remove("token");
        toast.success(t("messages.success.logged_out"));

        router.replace("/login");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to logout");
      },
    });
  };

  if (!person) {
    return null;
  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-[30px] w-[30px] flex items-center p-0 text-white hover:bg-transparent hover:text-white cursor-pointer "
          >
            <span className="sr-only">Open menu</span>
            <CircleUserIcon className="size-7 stroke-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="px-5 py-7 min-w-[280px] w-full"
        >
          <div className="flex flex-row gap-2.5 mb-7.5">
            <CustomAvatar
              className="w-[52px] h-[52px]"
              avatarUrl={person?.avatar_url}
              fallback={
                person ? getInitials(person?.last_name, person?.first_name) : ""
              }
              fallbackClassName="text-xl"
            />
            <div className="flex flex-col gap-1">
              <p className="font-semibold">
                {getFullName(
                  person?.first_name,
                  person?.last_name,
                  person?.patronymic
                )}
              </p>
              <InfoLabel className="text-sm">
                {t(`person.roles.${person.role}`)}
              </InfoLabel>
            </div>
          </div>
          <DropdownMenuItem
            className="text-text-regular border border-transparent focus:border focus:border-brand-default focus:bg-transparent"
            onClick={() => setDialogOpen(true)}
          >
            {t(`person.labels.account_settings`)}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-text-regular border border-transparent focus:border focus:border-brand-default focus:bg-transparent">
            {t(`person.labels.administrating`)}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleLogout()}
            className="text-text-regular focus:border-none focus:bg-transparent focus:text-action-minus"
          >
            {t(`auth.logout`)}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <ProfileInfo person={person} />
      </Dialog>
    </div>
  );
};

export default UserProfile;
