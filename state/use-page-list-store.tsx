import { create } from "zustand";
import cloneDeep from "lodash.clonedeep";

import { makeRandomId } from "@/utils/random-id";

export interface Page {
  id: string;
  title: string;
  contents: ContentType[];
}

export type ContentType = { id: string; type?: "heading1"; text: string };

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
  editContentType: ({ value }: { value: "heading1" }) => void;
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
      const clone = cloneDeep(state.pageList);
      const index = clone.findIndex((item: Page) => item.id === state.pageId);
      clone[index].title = value;

      return { ...state, pageList: clone };
    });
  },
  editContent: ({ field, value }) => {
    set((state) => {
      const index = state.pageList.findIndex(
        (item: Page) => item.id === state.pageId
      );
      const contentIndex = state.pageList[index].contents.findIndex(
        (content: ContentType) => content.id === field
      );

      state.pageList[index].contents[contentIndex].text = value?.replace(
        /\n/g,
        ""
      );

      return state;
    });
  },
  editContentType: ({ value }) => {
    set((state) => {
      const index = state.pageList.findIndex(
        (item: Page) => item.id === state.pageId
      );
      const contentIndex = 0;

      state.pageList[index].contents[contentIndex].type = value;

      return state;
    });
  },
  addContentLine: (currentIndex) => {
    set((state) => {
      const index = state.pageList.findIndex(
        (item: Page) => item.id === state.pageId
      );
      const id = makeRandomId();

      state.pageList[index].contents.splice(currentIndex + 1, 0, {
        id: `content_${id}`,
        text: "",
      });

      return state;
    });
  },
  removeContentLine: (currentIndex) => {
    set((state) => {
      const index = state.pageList.findIndex(
        (item: Page) => item.id === state.pageId
      );

      state.pageList[index].contents.splice(currentIndex, 1);

      return state;
    });
  },
}));

export default usePageListStore;
