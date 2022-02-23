import { Runtime } from '@renderer/util/runtime';

export async function parseCss(styleSheets: string[]) {
  const cssPathPromises = styleSheets.map(async css => {
    const path = await window.bridge.callMain('path-join', Runtime.currentTheme.path, css);
    return window.bridge.callMain('process-css', path);
  });

  const fulfilledContents = [] as string[];
  const styleContents = await Promise.allSettled(cssPathPromises);
  styleContents.forEach(path => {
    if (path.status === 'fulfilled') {
      fulfilledContents.push(path.value);
    }
  });
  return fulfilledContents;
}
