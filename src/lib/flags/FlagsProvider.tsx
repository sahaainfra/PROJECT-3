// Part 00 — client-side flag helper (section 5.7). Flags are evaluated server-side and
// delivered to the client through FlagsProvider; the client never decides flags itself.
"use client";

import { createContext, useContext } from "react";

export type ClientFlags = Record<string, boolean>;

const FlagsContext = createContext<ClientFlags>({});

export function FlagsProvider({ flags, children }: { flags: ClientFlags; children: React.ReactNode }) {
  return <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>;
}

export function useFlags(): ClientFlags {
  return useContext(FlagsContext);
}

export function useFlag(flagKey: string): boolean {
  return useContext(FlagsContext)[flagKey] === true;
}
