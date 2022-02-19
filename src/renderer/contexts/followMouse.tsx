import { FollowMouseMoveProperties } from '@common/config/type';
import { createContext, RefObject, useContext } from 'react';

export type FollowMouseElementInformation = {
  config: FollowMouseMoveProperties;
  element: RefObject<HTMLDivElement>;
  id: string;
};

export const FollowMouseContext = createContext<FollowMouseElementInformation[]>([]);
export const useFollowMouse = () => useContext(FollowMouseContext);
