import { useStyleContext, useTheme } from '@renderer/contexts';
import { loadFile } from '@renderer/util/polyfill';
import { Runtime } from '@renderer/util/runtime';
import { useEffect } from 'react';

export function useInjectCss() {
  const [theme] = useTheme();
  const [, setStyles] = useStyleContext();
  const cssNodes: HTMLLinkElement[] = [];

  useEffect(() => {
    const styleSheets = Runtime.config?.styleSheets as string[];
    if (!styleSheets || styleSheets.length === 0) {
      return;
    }

    const cssPathPromises = styleSheets.map(async css => {
      if (css.startsWith('https://')) {
        return css;
      }
      const path = await window.bridge.callMain('path-join', theme.path, css);
      return loadFile(path, 'text/css');
    });

    const newNodes = [] as string[];
    Promise.allSettled(cssPathPromises).then(allPath => {
      allPath.forEach(path => {
        if (path.status === 'fulfilled') {
          newNodes.push(path.value);
        }
      });
      setStyles(newNodes);
      console.log('css', newNodes);
    });
  }, [theme]);
  return cssNodes;
}
