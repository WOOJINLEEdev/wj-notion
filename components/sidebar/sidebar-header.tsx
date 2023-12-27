import Image, { StaticImageData } from "next/image";
import { ChevronDoubleLeftIcon } from "@heroicons/react/20/solid";

import useSideBarStore from "@/state/use-side-bar-store";

interface SidebarHeaderProps {
  icon: StaticImageData;
  title: string;
}

const SidebarHeader = ({ icon, title }: SidebarHeaderProps) => {
  const { isOpen, close } = useSideBarStore();

  return (
    <div className="relative flex justify-between items-center text-sm">
      <div className="flex items-center gap-1">
        <Image
          src={icon}
          alt="icon"
          width="24"
          height="24"
          className="rounded-md"
        />
        <span className="text-black font-medium">{title}</span>
      </div>

      <div
        className={`group/sidebar transition duration-100 ${
          isOpen ? "visible" : "invisible"
        } `}
      >
        <button
          type="button"
          aria-label="사이드바 닫기"
          className="w-6 h-6 p-1 group-hover/sidebar:bg-gray-200 group-hover/sidebar:rounded-md"
          onClick={close}
        >
          <ChevronDoubleLeftIcon className="w-full h-full" />
        </button>

        <div className="absolute top-8 right-[-40px] min-w-[95px] p-1 px-2 bg-gray-950 text-xs text-gray-300 font-semibold rounded-md shadow-sm invisible group-hover/sidebar:visible">
          <p>사이드바 닫기</p>
          <span className="text-[10px] text-slate-500">Ctrl+\</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;
