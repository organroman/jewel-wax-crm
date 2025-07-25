import { cn } from "@/lib/utils";

interface ChatItemEmptyProps {
  info: string;
  fontSize?: string;
}
const ChatItemEmpty = ({ info, fontSize = "text-xl" }: ChatItemEmptyProps) => {

  return (
    <div className="h-2/5 flex items-center justify-center">
      <p className={cn("font-bold text-text-muted", fontSize)}>{info}</p>
    </div>
  );
};

export default ChatItemEmpty;
