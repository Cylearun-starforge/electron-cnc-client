// import { useTheme } from '@renderer/contexts';
// import { loadFile } from '@renderer/util/polyfill';
// import { ButtonHTMLAttributes, ReactChild, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { ButtonHTMLAttributes, useEffect, useState, ReactNode, useRef } from 'react';
import { EccAlphaButtonProps } from './layout-html-extension/ecc-alpha-button';
import { useTheme } from '@renderer/contexts';
import { loadFile } from '@renderer/util/polyfill';
export type WithMaskProps = {
  ['src']?: string;
  className?: string;
  children: ReactNode;
};

// 获取元素的绝对位置坐标（像对于浏览器视区左上角）
function getElementViewPosition(element: HTMLElement) {
  // 计算x坐标
  let actualLeft = element.offsetLeft;
  let current = element.offsetParent as HTMLElement;
  while (current !== null) {
    actualLeft += current.offsetLeft + current.clientLeft;
    current = current.offsetParent as HTMLElement;
  }
  let elementScrollLeft;
  if (document.compatMode === 'BackCompat') {
    elementScrollLeft = document.body.scrollLeft;
  } else {
    elementScrollLeft = document.documentElement.scrollLeft;
  }
  const left = actualLeft - elementScrollLeft;
  // 计算y坐标
  let actualTop = element.offsetTop;
  current = element.offsetParent as HTMLElement;
  while (current !== null) {
    actualTop += current.offsetTop + current.clientTop;
    current = current.offsetParent as HTMLElement;
  }
  let elementScrollTop;
  if (document.compatMode === 'BackCompat') {
    elementScrollTop = document.body.scrollTop;
  } else {
    elementScrollTop = document.documentElement.scrollTop;
  }
  const right = actualTop - elementScrollTop;
  // 返回结果
  return { x: left, y: right };
}

export function AlphaButton({ children, ...props }: WithMaskProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>();
  const [theme] = useTheme();
  useEffect(() => {
    (async () => {
      contextRef.current = canvasRef.current!.getContext('2d');
      if (!props.src) {
        return;
      }
      const img = new Image();

      const path = await window.bridge.callMain('path-join', theme.path, props.src);
      const file = await loadFile(path);
      img.src = file;
      img.onload = () => {
        const ratioX = canvasRef.current!.width / img.width;
        const ratioY = canvasRef.current!.height / img.height;
        let finalX = 0;
        let finalY = 0;
        if (img.width / img.height > 1) {
          finalX = canvasRef.current!.width * ratioY;
          finalY = canvasRef.current!.height * ratioY;
        } else {
          finalX = canvasRef.current!.width * ratioX;
          finalY = canvasRef.current!.height * ratioX;
        }
        console.log(ratioX, ratioY, finalX, finalY);
        contextRef.current?.drawImage(img, 0, 0, finalX, finalY);
      };
    })();
  }, []);

  const onPixel = (x: number, y: number) => {
    const p = getElementViewPosition(canvasRef.current!);
    const relativeX = x - p.x;
    const relativeY = y - p.y;
    const { data } = contextRef.current!.getImageData(relativeX, relativeY, 1, 1);
    return data[3] !== 0;
  };
  console.log('class', props);
  return (
    <div
      onMouseOverCapture={e => {
        const on = onPixel(e.clientX, e.clientY);
        if (on) {
          console.log('can hover', props.className);
        } else {
          e.bubbles = false;
        }
      }}
      onClick={e => {
        console.log(e);
        const on = onPixel(e.clientX, e.clientY);
        if (on) {
          console.log('active', props.className);
        }
      }}
      className={props.className}
    >
      <canvas ref={canvasRef}>{children}</canvas>
    </div>
  );
}

// const { callMain } = window.bridge;
// export function AlphaButton({ mask, children, ...props }: EccAlphaButtonProps) {
//   const [maskFullPath, setMask] = useState(mask);
//   const [theme] = useTheme();
//   useEffect(() => {
//     if (!mask && typeof mask !== 'string') {
//       return;
//     }
//     callMain('path-join', theme.path, mask)
//       .then(path => {
//         return loadFile(path);
//       })
//       .then(path => {
//         setMask(path);
//       })
//       .catch(e => {
//         console.error('on ecc-alpha-button load mask:', e);
//       });
//   }, [mask, theme]);
//   return (
//     <ecc-alpha-button {...props} mask={maskFullPath}>
//       {children}
//     </ecc-alpha-button>
//   );
// }
