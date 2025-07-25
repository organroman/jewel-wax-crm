import { ChatMedia, ChatParticipant } from "@/types/order-chat.types";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { useChat } from "@/api/order-chat/use-order-chat";
import { useDialog } from "@/hooks/use-dialog";

import CustomAvatar from "@/components/shared/custom-avatar";
import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";
import Modal from "@/components/shared/modal/modal";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import ChatImages from "./chat-images";
import ChatItemEmpty from "./chat-item-empty";

import { getFullName, getInitials } from "@/lib/utils";

interface ChatInfoProps {
  opponent?: ChatParticipant;
  media: ChatMedia[];
  chatId: number;
  orderId: number;
}

const ChatInfo = ({ opponent, media, chatId, orderId }: ChatInfoProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const images = media.filter((m) => m.type === "image") ?? [];

  const {
    dialogOpen: isDeleteDialogOpen,
    setDialogOpen: setIsDeleteDialogOpen,
    closeDialog: closeDeleteDialog,
  } = useDialog();

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["order", orderId],
    });
    queryClient.invalidateQueries({
      queryKey: ["chatDetails", chatId],
    });
    closeDeleteDialog();
  };

  const { deleteChat } = useChat.deleteChat({
    handleSuccess: handleDeleteSuccess,
    t,
  });

  return (
    <div className="flex h-full flex-col min-w-[320px] max-w-[320px] mr-7">
      <div className="h-full flex flex-col overflow-hidden rounded-sm border border-ui-border ">
        {!opponent ? (
          <ChatItemEmpty info={t("messages.info.no_opponent")} />
        ) : (
          <div className="bg-ui-column p-5 flex gap-2.5 rounded-t-sm">
            <CustomAvatar
              className="h-13 w-13 "
              avatarUrl={opponent.avatar_url ?? ""}
              fallback={getInitials(opponent.first_name, opponent.last_name)}
              fallbackClassName="bg-action-plus/80"
            />
            <div className="flex flex-col gap-3">
              <InfoValue className="text-text-regular font-medium text-md">
                {getFullName(
                  opponent.first_name,
                  opponent.last_name,
                  opponent.patronymic
                )}
              </InfoValue>
              <InfoLabel className="text-sm">{opponent.phone}</InfoLabel>
              <div className="flex items-center gap-5">
                <InfoLabel className="text-text-regular">
                  {t(`person.roles.${opponent.role.value}`)}
                </InfoLabel>
                <InfoLabel className="text-action-alert">
                  № ID {opponent.person_id}
                </InfoLabel>
              </div>
            </div>
          </div>
        )}
        <div className="h-full flex flex-col ">
          <InfoLabel className="ml-5 mt-4 mb-1.5">
            {t("order_chat.images")}
          </InfoLabel>
          <Separator className="bg-ui-border h-0.5 data-[orientation=horizontal]:h-0.5" />
          <ChatImages images={images} />
        </div>
      </div>
      <Button
        variant="ghostDestructive"
        className="self-end text-action-minus text-xs underline underline-offset-3 mb-2 cursor-pointer"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        {t("order_chat.delete")}
      </Button>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Modal
          destructive
          header={{
            title: t("order_chat.modal.delete.title"),
            descriptionFirst: t("messages.info.confirm_delete"),
            descriptionSecond: t("messages.info.action_undone"),
          }}
          footer={{
            buttonActionTitleContinuous: t("buttons.delete_continuous"),
            buttonActionTitle: t("buttons.delete"),
            actionId: chatId,
            isPending: deleteChat.isPending,
            action: () => deleteChat.mutate(chatId),
          }}
        />
      </Dialog>
    </div>
  );
};

export default ChatInfo;
