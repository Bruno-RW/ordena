import { type FC } from "react";

import { DataProvider } from "@/providers/data/DataProvider";

interface ContextProviderProps {
  children: React.ReactNode;
}

const ContextProvider: FC<ContextProviderProps> = ({ children }) => {
  return <DataProvider>{children}</DataProvider>;
};

export default ContextProvider;
