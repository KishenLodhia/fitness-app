import React from "react";

const ThemeContext = React.createContext({
  isDarkTheme: false,
  toggleTheme: () => {},
});

export { ThemeContext }; // Export the context itself
