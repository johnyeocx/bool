import React, { useState } from "react";
import { DarkTheme } from "./themes";
import { Theme } from "./types/themeTypes";

export const ThemeContext = React.createContext<Theme>(DarkTheme);

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState<Theme>(DarkTheme);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
