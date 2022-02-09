import { createContext, ReactNode, useContext, useState } from 'react';

export type ThemeType = {
  name: string;
  path: string;
};
type ThemeContextType = [ThemeType, (theme: ThemeType) => void];

const ThemeContext = createContext<ThemeContextType>(null as unknown as ThemeContextType);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>({
    name: '',
    path: '',
  });

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
