"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import InitUser from "@/InitUser";
import GeoUpdater from "./GeoUpdater";
import { useAppSelector } from "@/redux/hooks";

interface PropsType {
  children: React.ReactNode;
}

function AppContent({ children }: PropsType) {
  const userData = useAppSelector(
    (state) => state.User.userData
  );

  return (
    <>
      <InitUser />
      <GeoUpdater userId={userData?._id?.toString() ?? ""} />
      {children}
    </>
  );
}

export default function Providers({ children }: PropsType) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <AppContent>
          {children}
        </AppContent>
      </ReduxProvider>
    </SessionProvider>
  );
}