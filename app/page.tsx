"use client";

import Header from "@/components/header";
import Content from "@/components/content";
import usePageListStore from "@/state/use-page-list-store";
import useSideBarStore from "@/state/use-side-bar-store";

export default function Home() {
  const { isOpen } = useSideBarStore();
  const { pageList, pageId } = usePageListStore();

  return (
    <div
      className={`${
        isOpen ? "w-[calc(100vw-240px)] ml-[240px]" : "w-full"
      }  transition-all duration-500`}
    >
      <Header />
      <main className="relative flex min-h-screen justify-center">
        {pageList?.length > 0 && pageId && <Content />}
      </main>
    </div>
  );
}
