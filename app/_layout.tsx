import { Slot } from "expo-router";
import { SessionProvider } from "./ctx";
import { PaperProvider, MD3LightTheme as DefaultTheme } from "react-native-paper";

import * as React from "react";

const theme = {
  ...DefaultTheme,

  colors: {
    primary: "rgb(150, 73, 0)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(255, 220, 198)",
    onPrimaryContainer: "rgb(49, 19, 0)",
    secondary: "rgb(0, 95, 175)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(212, 227, 255)",
    onSecondaryContainer: "rgb(0, 28, 58)",
    tertiary: "rgb(104, 71, 192)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(232, 221, 255)",
    onTertiaryContainer: "rgb(33, 0, 93)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(32, 26, 23)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(32, 26, 23)",
    surfaceVariant: "rgb(244, 222, 211)",
    onSurfaceVariant: "rgb(82, 68, 60)",
    outline: "rgb(132, 116, 106)",
    outlineVariant: "rgb(215, 195, 183)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(54, 47, 43)",
    inverseOnSurface: "rgb(251, 238, 232)",
    inversePrimary: "rgb(255, 183, 134)",
    elevation: {
      level0: "transparent",
      level1: "rgb(250, 242, 242)",
      level2: "rgb(247, 237, 235)",
      level3: "rgb(244, 231, 227)",
      level4: "rgb(242, 230, 224)",
      level5: "rgb(240, 226, 219)",
    },
    surfaceDisabled: "rgba(32, 26, 23, 0.12)",
    onSurfaceDisabled: "rgba(32, 26, 23, 0.38)",
    backdrop: "rgba(58, 46, 38, 0.4)",
  },
};

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <PaperProvider theme={theme}>
      <SessionProvider>
        <Slot />
      </SessionProvider>
    </PaperProvider>
  );
}
