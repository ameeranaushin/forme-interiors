"use client";

import { createContext, useContext } from "react";

// Other routes keep their existing lifecycle without a loader provider.
export const PageReadyContext = createContext(true);
export const usePageReady = () => useContext(PageReadyContext);