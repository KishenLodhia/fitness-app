// Root.js
import { Slot } from "expo-router";
import { SessionProvider } from "./ctx";
import * as React from "react";
import { ThemeProvider } from "./ThemeContext";

export default function Root() {
  return (
    <ThemeProvider>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </ThemeProvider>
  );
}
