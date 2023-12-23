"use client";

import { Bars3Icon, ChevronDoubleRightIcon } from "@heroicons/react/20/solid";

import useSideBarStore from "@/state/use-side-bar-store";

const Header = () => {
  const { isOpen, open } = useSideBarStore();

  return (
    <header>
      <div className="relative flex">
        <div
          className={`group/menu relative flex items-center justify-center w-12 h-12 ${
            isOpen ? "invisible" : "visible"
          }`}
        >
          <div
            role="button"
            className="absolute top-4 left-4 transition ease-in-out delay-150 group-hover/menu:invisible"
          >
            <Bars3Icon className="w-4 h-4" />
          </div>

          <div className="group/sidebar invisible transition-opacity group-hover/menu:visible">
            <div
              role="button"
              aria-label="사이드바 열기"
              className="w-6 h-6 p-1 group-hover/sidebar:bg-gray-200 group-hover/sidebar:rounded-md"
              onClick={open}
            >
              <ChevronDoubleRightIcon className="w-full h-full" />
            </div>

            <div className="absolute top-3 left-10 min-w-[95px] p-1 px-2 bg-gray-950 text-xs text-gray-300 font-semibold rounded-md shadow-sm invisible group-hover/sidebar:visible">
              <p>사이드바 열기</p>
              <span className="text-[10px] text-slate-500">Ctrl+\</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
