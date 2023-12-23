"use client";

import { useEffect } from "react";

import PageAddition from "@/components/sidebar/page-addition";
import SidebarHeader from "@/components/sidebar/sidebar-header";
import PageList from "@/components/sidebar/page-list";
import useSideBarStore from "@/state/use-side-bar-store";
import usePageListStore from "@/state/use-page-list-store";
import WjIcon from "@/public/wj-icon.png";

const sidebarStyles = {
  base: "w-60 min-h-screen p-3 ml-[-240px] bg-[#f7f7f7] transition-all duration-500 transform",
  open: "translate-x-[240px] shadow-lg",
  close: "translate-x-0 ml-[-240px]",
};

const SideBar = () => {
  const { isOpen } = useSideBarStore();
  const { pageList, initPageId } = usePageListStore();

  useEffect(() => {
    if (pageList.length === 0) {
      initPageId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageList]);

  return (
    <aside
      className={`${sidebarStyles.base} ${
        isOpen ? sidebarStyles.open : sidebarStyles.close
      }`}
    >
      <nav className="w-full h-full text-gray-500">
        <SidebarHeader title="이우진의 Notion" icon={WjIcon} />
        <PageAddition />
        <PageList />
      </nav>
    </aside>
  );
};

export default SideBar;
