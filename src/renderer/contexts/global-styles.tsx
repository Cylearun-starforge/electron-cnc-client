import { createContext, ReactNode, useContext, useState } from 'react';

type StyleContext = string[];
type Setter = (styles: StyleContext) => void;
export type GlobalStyleContextType = [StyleContext, Setter];
const Context = createContext<GlobalStyleContextType>(null as unknown as GlobalStyleContextType);

export const useGlobalStyle = () => useContext(Context);

export const GlobalStyleProvider = ({ children }: { children: ReactNode }) => {
  const [style, setStyle] = useState<StyleContext>([]);
  return <Context.Provider value={[style, setStyle]}>{children}</Context.Provider>;
};
