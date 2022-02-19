import { createContext, ReactNode, useContext, useState } from 'react';

type StyleContext = string[];
type Setter = (styles: StyleContext) => void;
export type PageStyleContextType = [StyleContext, Setter];
const Context = createContext<PageStyleContextType>(null as unknown as PageStyleContextType);

export const usePageStyle = () => useContext(Context);

export const PageStyleProvider = ({ children }: { children: ReactNode }) => {
  const [style, setStyle] = useState<StyleContext>([]);
  return <Context.Provider value={[style, setStyle]}>{children}</Context.Provider>;
};
