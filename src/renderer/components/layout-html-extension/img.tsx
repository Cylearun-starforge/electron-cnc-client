import { ImgHTMLAttributes, useEffect, useState } from 'react';
import { Runtime } from '@renderer/util/runtime';

type ImageProps = ImgHTMLAttributes<HTMLImageElement>;
export const Image = ({ src, ...rest }: ImageProps) => {
  const [imgSource, setImgSource] = useState('');
  useEffect(() => {
    if (typeof src !== 'string') {
      return;
    }
    Runtime.loadThemeFile(src).then(setImgSource);
  }, [src]);
  return <img src={imgSource} {...rest} />;
};
