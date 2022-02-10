import { createContext, ReactNode, useContext, useState } from 'react';

type StyleContext = string[];
type Setter = (styles: StyleContext) => void;
export type StyleContextType = [StyleContext, Setter];
export const Context = createContext<StyleContextType>(null as unknown as StyleContextType);

export const useStyleContext = () => useContext(Context);

export const StyleProvider = ({ children }: { children: ReactNode }) => {
  const [style, setStyle] = useState<StyleContext>([]);
  return <Context.Provider value={[style, setStyle]}>{children}</Context.Provider>;
};
