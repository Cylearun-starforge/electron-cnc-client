import { FollowMouseMoveProperties } from '@common/config/type';
import { DeepPartial } from '@common/utils';
import { createContext, useContext } from 'react';

export type FollowMouseElementInformation = {
  config: DeepPartial<FollowMouseMoveProperties>;
  elementId: string;
};

export const FollowMouseContext = createContext<FollowMouseElementInformation[]>([]);
export const useFollowMouse = () => useContext(FollowMouseContext);
