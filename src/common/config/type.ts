import { DeepPartial } from '@common/utils';

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
    }>;
  };
}>;
