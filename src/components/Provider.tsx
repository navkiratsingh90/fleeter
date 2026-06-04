"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { RootState, store } from "@/redux/store";
import InitUser from "@/InitUser";
import GeoUpdater from "./GeoUpdater";
import { useAppSelector } from "@/redux/hooks";

interface PropsType {
  children: React.ReactNode;
}

const Providers = ({ children }: PropsType) => {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
      <InitUser /> 
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
};

export default Providers;