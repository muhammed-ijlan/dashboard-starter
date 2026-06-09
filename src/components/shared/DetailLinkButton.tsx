import { ExternalLink } from "lucide-react";

interface DetailLinkButtonProps {
  onClick: () => void;
  size?: number;
}

export const DetailLinkButton = ({
  onClick,
  size = 15,
}: DetailLinkButtonProps) => {
  return (
    <button
      className=" transition-colors cursor-pointer shrink-0"
      onClick={onClick}
    >
      <ExternalLink size={size} className="text-[#4A5565]" />
    </button>
  );
};
