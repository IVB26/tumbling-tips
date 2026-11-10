import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { dark, light, Colors } from './theme';

const Ctx = createContext<Colors>(light);
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const scheme = useColorScheme();
  return <Ctx.Provider value={scheme === 'dark' ? dark : light}>{children}</Ctx.Provider>;
};
export const useColors = () => useContext(Ctx);
