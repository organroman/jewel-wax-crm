import { Conversation } from "@/types/request.types";

import { useUnreadStore } from "@/stores/use-unread-store";

import SearchInput from "../shared/search-input";
import ConversationItem from "./conversation-item";

import { splitUnread } from "@/lib/split-unread";

interface ConversationsProps {
  conversations: Conversation[];
}

const Conversations = ({ conversations }: ConversationsProps) => {
  const { byConversation } = useUnreadStore((s) => s);
  const badges = splitUnread(byConversation).external;

  return (
    <div className="w-1/4 min-w-[346px] border-r border-r-ui-border">
      <div className="p-5 border-b border-b-ui-border">
        <SearchInput />
      </div>
      <div className="flex flex-col flex-1 overflow-y-auto">
        {conversations.map((c) => {
          const badge = badges[c.id];

          return <ConversationItem key={c.id} conversation={c} badge={badge} />;
        })}
      </div>
    </div>
  );
};

export default Conversations;
