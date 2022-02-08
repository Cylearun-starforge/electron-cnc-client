import { createContext, ReactNode, useContext, useState } from 'react';

type ThemeContextType = [string, (theme: string) => void];

const ThemeContext = createContext<ThemeContextType>(null as unknown as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('');

  return <ThemeContext.Provider value={[theme, setTheme]}>
    {children}
  </ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext)
}