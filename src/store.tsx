import axios, { AxiosError } from "axios";
import type { Key } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";

interface Item {
  key: string | number;
  id: number;
  title: string;
  price: number;
  [key: string]: string | number;
}

interface Cache {
  [key: string]: Item[];
}

interface Total {
  [key: string]: number;
}

interface Sort {
  sortField: Key | readonly Key[] | undefined;
  sortOrder: string | null | undefined;
}

interface LoginValues {
  username?: string;
  password?: string;
  remember?: boolean;
}

interface State {
  items: Item[];
  loading: boolean;
  error: string | null;
  percent: number;
  total: Total;
  cache: Cache;
  currentPage: number;
  searchString: string;
  openModal: boolean;
  sortParams: Sort;
  isAuth: boolean;
  token: string;
  remember: boolean;
  setSortParams: (sortParams: Sort) => void;
  addItem: (item: Item) => void;
  setPage: (page: number) => void;
  setRemember: (remember: boolean) => void;
  setOpenModal: (openModal: boolean) => void;
  removeItem: (id: number) => void;
  login: (values: LoginValues) => void;
  getItems: (
    page: number,
    pageSize: number,
    search: string,
    sortParams: Sort,
  ) => void;
}

const useStore = create<State>()(
  devtools((set, get) => ({
    cache: {},
    items: [],
    currentPage: 1,
    searchString: "q=&limit=20&skip=0",
    loading: false,
    error: null,
    percent: 0,
    total: {},
    token: "",
    sortParams: {},
    openModal: false,
    isAuth: false,
    remember: true,
    login: async (values) => {
      set({
        loading: true,
        error: null,
        isAuth: false,
      });
      const body = {
        username: values.username,
        password: values.password,
        expiresInMins: 30,
        credentials: "include",
      };
      try {
        const response = await axios.post(
          `https://dummyjson.com/auth/login`,
          body,
        );
        set({
          isAuth: true,
          token: response.data.accessToken,
        });
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError?.response) {
          set({ error: `Ошибка: ${axiosError?.response?.data?.message}` });
        } else if (axiosError.request) {
          set({ error: `Нет ответа от сервера:${axiosError.request}` });
        } else {
          set({ error: `Ошибка:${axiosError.message}` });
        }
      } finally {
        set({ loading: false });
      }
    },
    getItems: async (page, pageSize, search, sortParams) => {
      const { cache } = get();
      const searchQuery = `q=${search}&limit=${pageSize}&skip=${page * pageSize - pageSize}${sortParams?.sortField ? `&sortBy=${sortParams?.sortField}&order=${sortParams?.sortOrder}` : ""}`;
      if (cache[searchQuery]) {
        set({
          currentPage: page,
          searchString: searchQuery,
        });
        return;
      }
      set({
        loading: true,
        error: null,
        percent: 0,
        currentPage: page,
        searchString: searchQuery,
      });
      const token = Cookies.get("token");
      try {
        const response = await axios.get(
          `https://dummyjson.com/products/search?${searchQuery}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },

            onDownloadProgress: (progressEvent) => {
              const total = progressEvent.total ?? 1; // Обработка возможного null
              const current = progressEvent.loaded;
              const percentage = Math.round((current * 100) / total);
              set({ percent: percentage });
            },
          },
        );
        set((state) => ({
          cache: {
            ...state.cache,
            [searchQuery]: response.data.products,
          },
          total: {
            ...state.total,
            [searchQuery]: response.data.total,
          },
          isLoading: false,
        }));
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError?.response) {
          set({ error: `Ошибка: ${axiosError?.response?.data?.message}` });
        } else if (axiosError.request) {
          set({ error: `Нет ответа от сервера:${axiosError.request}` });
        } else {
          set({ error: `Ошибка:${axiosError.message}` });
        }
      } finally {
        set({ loading: false });
      }
    },
    addItem: (item) => {
      set(
        (state: State): Partial<State> => ({
          cache: {
            ...state.cache,
            [state.searchString]: [item, ...state.cache[state.searchString]],
          },
          total: {
            ...state.total,
            [state.searchString]: state.total[state.searchString] + 1,
          },
        }),
      );
    },
    setPage: (page) => set({ currentPage: page }),
    setRemember: (remember) => set({ remember: remember }),
    setOpenModal: (openModal) => set({ openModal: openModal }),
    setSortParams: (sort) => set({ sortParams: sort }),
  })),
);

export default useStore;
