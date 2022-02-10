import { DeepPartial } from '@common/utils';
import { ClientFeatureType } from './features';

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

export type ComponentDeclaration = {
  text: string;
  image: string;
  style: object;
};

export type CarouselProperties = {
  auto: boolean;
  manualSwitch: boolean;
  title: Array<{}>;
};

export type ClientConfigurationType = DeepPartial<{
  defaultTheme: string;
  features: ClientFeatureType[];
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
    campaign: ComponentDeclaration;
  };
}>;
