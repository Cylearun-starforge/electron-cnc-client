import { DeepPartial } from '@common/utils';

export type FollowMouseMoveProperties = {
  speed: {
    x: number;
    y: number;
  };
  offset: {
    x: number;
    y: number;
  };
  base: {
    x: 'left' | 'right';
    y: 'top' | 'bottom';
  };
  maxMove: {
    bottom: number;
    top: number;
    left: number;
    right: number;
  };
};
export type ClientConfigurationType = DeepPartial<{
  defaultTheme: string;
  loading: {
    text: string;
    image: string;
    style: object;
  };
  main: {
    background: Array<{
      image: string;
      style: object;
      followMouse: FollowMouseMoveProperties;
    }>;
  };
}>;
