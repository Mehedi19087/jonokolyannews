"use client";
import { createContext, useContext } from "react";

const NewsContext = createContext({categories: [], articles: [], error: false});
export const useNews = () => useContext(NewsContext);
export default function NewsProvider({data, children}) {
  return <NewsContext.Provider value={data}>{children}</NewsContext.Provider>;
}
