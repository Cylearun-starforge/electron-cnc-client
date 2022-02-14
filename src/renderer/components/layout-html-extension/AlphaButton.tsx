// import { useTheme } from '@renderer/contexts';
// import { loadFile } from '@renderer/util/polyfill';
// import { ButtonHTMLAttributes, ReactChild, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import { ButtonHTMLAttributes, useEffect, useState, ReactNode, useRef } from 'react';
import { useTheme } from '@renderer/contexts';
import { loadFile } from '@renderer/util/polyfill';
export type WithMaskProps = {
  src?: string;
  hover?: string;
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
  const normalCanvas = useRef<HTMLCanvasElement>(null);
  const hoverCanvas = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>();
  const [theme] = useTheme();
  const [opacity, setOpacity] = useState(0);
  const show = () => {
    if (opacity !== 0) {
      return;
    }
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        setOpacity(o => o + 0.1);
      }, 200 * i);
    }
  };

  const hide = () => {
    if (opacity !== 1) {
      return;
    }
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        setOpacity(o => o - 0.1);
      }, 400 * i);
    }
  };
  useEffect(() => {
    (async () => {
      contextRef.current = normalCanvas.current!.getContext('2d');
      if (!props.src || !props.hover) {
        return;
      }
      const img = new Image();
      const imgH = new Image();

      const path = await window.bridge.callMain('path-join', theme.path, props.src);
      const file = await loadFile(path);
      const hoverPath = await window.bridge.callMain('path-join', theme.path, props.hover);
      const hoverFile = await loadFile(hoverPath);
      img.src = file;
      img.onload = () => {
        console.log('draw size', containerRef.current!.clientWidth, containerRef.current!.clientHeight);
        contextRef.current?.drawImage(img, 0, 0, containerRef.current!.clientWidth, containerRef.current!.clientHeight);
      };
      imgH.src = hoverFile;
      imgH.onload = () => {
        const ctx = hoverCanvas.current!.getContext('2d')!;
        ctx.drawImage(img, 0, 0, containerRef.current!.clientWidth, containerRef.current!.clientHeight);
      };
    })();
  }, [props.hover, props.src, theme]);

  const onPixel = (x: number, y: number) => {
    const p = getElementViewPosition(normalCanvas.current!);
    const relativeX = x - p.x;
    const relativeY = y - p.y;
    const { data } = contextRef.current!.getImageData(relativeX, relativeY, 1, 1);
    console.log(data);
    return data[3] !== 0;
  };
  return (
    <div
      ref={containerRef}
      className={props.className}
      style={{
        position: 'relative',
      }}
    >
      <canvas
        ref={hoverCanvas}
        onMouseMoveCapture={e => {
          const on = onPixel(e.clientX, e.clientY);
          console.log(on);
          if (on) {
            console.log('can hover', props.className);
            show();
          } else {
            hide();
            e.bubbles = false;
            console.log('no bubble');
          }
        }}
        onClick={e => {
          console.log(e);
          const on = onPixel(e.clientX, e.clientY);
          if (on) {
            console.log('active', props.className);
          }
        }}
        onMouseLeave={e => {
          hide();
        }}
      ></canvas>
      <canvas
        ref={normalCanvas}
        onMouseMoveCapture={e => {
          const on = onPixel(e.clientX, e.clientY);
          console.log(on);
          if (on) {
            console.log('can hover', props.className);
            show();
          } else {
            hide();
            e.bubbles = false;
            console.log('no bubble');
          }
        }}
        onClick={e => {
          console.log(e);
          const on = onPixel(e.clientX, e.clientY);
          if (on) {
            console.log('active', props.className);
          }
        }}
        onMouseLeave={e => {
          hide();
        }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity,
        }}
      ></canvas>
    </div>
  );
}
