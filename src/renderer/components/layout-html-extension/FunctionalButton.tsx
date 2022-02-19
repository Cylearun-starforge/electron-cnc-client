import { useTheme } from '@renderer/contexts';
import { loadFile } from '@renderer/util/polyfill';
import { ButtonHTMLAttributes, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

export type FunctionalityType = 'external-link' | 'client-link' | 'close-app';

export type FunctionalButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ['func-type']?: FunctionalityType;
  ['hover-class']?: string;
  className?: string;
  link?: string;
  mask?: string;
};
export function FunctionalButton({ children, mask, link, className, ...props }: FunctionalButtonProps) {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const canvas = useRef(document.createElement('canvas'));
  const [theme] = useTheme();
  const [hover, setHover] = useState(false);

  const onPixel = (x: number, y: number) => {
    const p = getElementViewPosition(buttonRef.current!);
    const pixel = canvas.current!.getContext('2d')!.getImageData(x - p.x, y - p.y, 1, 1);
    if (pixel.data[0] === 0 && pixel.data[1] === 0 && pixel.data[2] === 0) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    (async () => {
      if (!mask) {
        return;
      }

      const path = await window.bridge.callMain('path-join', theme.path, mask);
      const file = await loadFile(path);
      const image = new Image();
      image.src = file;
      image.onload = () => {
        canvas.current.width = buttonRef.current!.clientWidth;
        canvas.current.height = buttonRef.current!.clientHeight;
        const ctx = canvas.current.getContext('2d');
        ctx?.drawImage(
          image,
          0,
          0,
          image.width,
          image.height,
          0,
          0,
          buttonRef.current!.clientWidth,
          buttonRef.current!.clientHeight
        );
        console.log('canvas size', canvas.current.width, canvas.current.height);
      };
    })();
  }, [theme, mask]);

  return (
    <button
      onMouseMove={e => {
        const on = onPixel(e.clientX, e.clientY);
        setHover(on);
      }}
      ref={buttonRef}
      className={`${className} ${hover ? props['hover-class'] : ''}`}
      {...props}
      onClick={e => {
        e.preventDefault();
        if (mask) {
          if (!hover) {
            return;
          }
        }
        const funcType = props['func-type'];
        if (!funcType) {
          return;
        }
        if (funcType === 'close-app') {
          window.bridge.callMain('close-app');
          return;
        }
        if (!link) {
          return;
        }
        if (props['func-type'] === 'external-link') {
          window.bridge.callMain('open-in-explorer', link);
          return;
        }
        navigate(link);
      }}
    >
      {children}
    </button>
  );
}

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
