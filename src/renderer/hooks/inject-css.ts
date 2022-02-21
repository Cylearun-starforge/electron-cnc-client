import { Runtime } from '@renderer/util/runtime';
import { useEffect } from 'react';

export function useInjectCss(setStyles?: (styles: string[]) => void, styleSheets?: string[]) {
  useEffect(() => {
    if (!setStyles) {
      return;
    }
    if (!styleSheets || styleSheets.length === 0) {
      return;
    }

    const cssPathPromises = styleSheets.map(async css => {
      const path = await window.bridge.callMain('path-join', Runtime.currentTheme.path, css);
      return window.bridge.callMain('process-css', path);
    });

    const newNodes = [] as string[];
    Promise.allSettled(cssPathPromises).then(allPath => {
      allPath.forEach(path => {
        if (path.status === 'fulfilled') {
          newNodes.push(path.value);
        }
      });
      setStyles(newNodes);
    });
  }, [styleSheets, setStyles]);
}
