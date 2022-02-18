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
  class: string;
};

export type CarouselProperties = {
  auto: {
    duration: number;
    ltr: boolean;
  };
  title: {};
  mask: string;
  class: string;
  content: Array<{
    image: string;
    class: string;
    href: string;
  }>;
};

export type WindowSize = {
  width: number;
  height: number;
};

export type ClientConfigurationType = DeepPartial<{
  defaultTheme: string;
  defaultSize: WindowSize;
  minimalSize: WindowSize;
  maximalSize: WindowSize;
  features: ClientFeatureType[];
  styleSheets: string[];
  loading: {
    text: string;
    image: string;
    class: string;
  };
  main: string;
}>;
