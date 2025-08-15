import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type CustomAvatarProps = {
  avatarUrl?: string;
  className?: string;
  fallbackClassName?: string;
  fallback: string;
};

const CustomAvatar = ({
  avatarUrl,
  fallback,
  className,
  fallbackClassName,
}: CustomAvatarProps) => {
  return (
    <Avatar className={className}>
      {avatarUrl && <AvatarImage src={avatarUrl} />}

      {!avatarUrl && (
        <AvatarFallback
          className={cn("bg-accent-blue text-white", fallbackClassName)}
        >
          {fallback}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default CustomAvatar;
