import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type StyleContext = {
  global: string[];
  page: string[];
};
type Setter = (styles: string[]) => void;

type StyleContextActions = {
  setGlobal: Setter;
  setPage: Setter;
};
export type PageStyleContextType = [StyleContext, StyleContextActions];

const Context = createContext<PageStyleContextType>(null as unknown as PageStyleContextType);

export const useStyle = () => useContext(Context);

export const StyleProvider = ({ children }: { children: ReactNode }) => {
  const [style, setStyle] = useState<StyleContext>({ global: [], page: [] });
  const actions = useMemo<StyleContextActions>(
    () => ({
      setGlobal(styles) {
        setStyle(prev => ({
          ...prev,
          global: styles,
        }));
      },
      setPage(styles) {
        setStyle(prev => ({
          ...prev,
          page: styles,
        }));
      },
    }),
    []
  );
  return <Context.Provider value={[style, actions]}>{children}</Context.Provider>;
};
