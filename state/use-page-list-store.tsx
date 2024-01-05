import { create } from "zustand";

import { makeRandomId } from "@/utils/random-id";

export interface Page {
  id: string;
  title: string;
  contents: Content[];
}

type Content = { id: string; text: string };

type CreatePageParams = Omit<Page, "id">;

interface UsePageListStoreProps {
  pageId: string;
  pageList: Page[];
  getCurrentPage: () => Page | undefined;
  addPage: (page: CreatePageParams) => void;
  deletePage: (pageId: string) => void;
  setPageList: (pages: Page[]) => void;
  setPageId: (pageId: string) => void;
  initPageId: () => void;
  editTitle: ({ value }: { value: string }) => void;
  editContent: ({ field, value }: { field: string; value: string }) => void;
  addContentLine: (currentIndex: number) => void;
  removeContentLine: (currentIndex: number) => void;
}

const usePageListStore = create<UsePageListStoreProps>()((set, get) => ({
  pageId: "",
  pageList: [],
  getCurrentPage: () => {
    return get().pageList.find((item: Page) => item.id === get().pageId);
  },
  addPage: (page) => {
    const id = makeRandomId();
    set((state) => ({
      ...state,
      pageList: [...state.pageList, { ...page, id }],
      pageId: id,
    }));
  },
  deletePage: (pageId) => {
    set((state) => ({
      ...state,
      pageList: state.pageList.filter((page) => page.id !== pageId),
    }));
  },
  setPageList: (pages) => {
    set((state) => ({
      ...state,
      pageList: pages,
    }));
  },
  setPageId: (pageId) => {
    set((state) => ({ ...state, pageId: pageId }));
  },
  initPageId: () => {
    set((state) => ({ ...state, pageId: "" }));
  },

  editTitle: ({ value }) => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.pageList));
      const index = clone.findIndex((item: Page) => item.id === state.pageId);
      clone[index].title = value;

      return { ...state, pageList: clone };
    });
  },
  editContent: ({ field, value }) => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.pageList));
      const index = clone.findIndex((item: Page) => item.id === state.pageId);
      const contentIndex = clone[index].contents.findIndex(
        (content: Content) => content.id === field
      );

      clone[index].contents[contentIndex].text = value?.replace(/\n/g, "");

      return { ...state, pageList: clone };
    });
  },
  addContentLine: (currentIndex) => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.pageList));
      const index = clone.findIndex((item: Page) => item.id === state.pageId);
      const id = makeRandomId();

      clone[index].contents.splice(currentIndex + 1, 0, {
        id: `content_${id}`,
        text: "",
      });

      return { ...state, pageList: clone };
    });
  },
  removeContentLine: (currentIndex) => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.pageList));
      const index = clone.findIndex((item: Page) => item.id === state.pageId);

      clone[index].contents.splice(currentIndex, 1);

      return { ...state, pageList: clone };
    });
  },
}));

export default usePageListStore;
