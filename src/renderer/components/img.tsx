import { ImgHTMLAttributes, useEffect, useState } from 'react';
import { useTheme } from '@renderer/contexts';
import { loadFile } from '@renderer/util/polyfill';

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;
export const Image = ({ src, ...rest }: ImageProps) => {
  const [imgSource, setImgSource] = useState('');
  const [theme] = useTheme();
  useEffect(() => {
    if (typeof src !== 'string') {
      return;
    }
    window.bridge.callMain('path-join', theme.path, src).then(loadFile).then(setImgSource);
  }, [src, theme]);
  return <img src={imgSource} {...rest} />;
};
