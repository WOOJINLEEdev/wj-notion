import { create } from "zustand";

export interface Page {
  id: string;
  title: string;
  content: string;
}

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
  editPage: ({ value, field }: { value: string; field: string }) => void;
}

const usePageListStore = create<UsePageListStoreProps>()((set, get) => ({
  pageId: "",
  pageList: [],
  getCurrentPage: () => {
    return get().pageList.find((item: Page) => item.id === get().pageId);
  },
  addPage: (page) => {
    const id = Math.random().toString(36).substring(2, 10);
    set((state) => ({
      ...state,
      pageList: [...state.pageList, { ...page, id }],
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
  editPage: ({ value, field }) => {
    set((state) => {
      const clone = JSON.parse(JSON.stringify(state.pageList));
      const index = clone.findIndex((item: Page) => item.id === state.pageId);
      clone[index][field] = value;

      return { ...state, pageList: clone };
    });
  },
}));

export default usePageListStore;
