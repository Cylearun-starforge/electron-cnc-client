import { FC, ReactNode, useEffect, useState } from 'react';
import { FullScreen } from '@renderer/components';
import { Runtime } from '@renderer/util/runtime';
import { parseHtml } from '@renderer/util/parse-html';
import { parseCss } from '@renderer/util/parse-css';
import { useStyle } from '@renderer/contexts';

const { callMain } = window.bridge;

function useParseLayout(layout: string, styleSheets: string[]) {
  const [node, setNode] = useState<ReactNode>();
  const [, { setPage }] = useStyle();
  useEffect(() => {
    (async () => {
      const pageStylePromise = parseCss(styleSheets);
      const layoutPath = await callMain('path-join', Runtime.currentTheme.path, layout);
      const buffer = await callMain('request-local-file', layoutPath);
      const decoder = new TextDecoder();

      const htmlNode = await parseHtml(decoder.decode(buffer));
      const css = await pageStylePromise;
      setPage(css);
      setNode(htmlNode);
    })();
  }, []);
  return node;
}

type PageProps = {
  layout: string;
  styleSheets?: string[];
};

export const PageContainer: FC<PageProps> = ({ layout, styleSheets }) => {
  const node = useParseLayout(layout, styleSheets ?? []);
  return <FullScreen>{node}</FullScreen>;
};
