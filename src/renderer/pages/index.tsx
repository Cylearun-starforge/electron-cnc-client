import { FC, ReactNode, useEffect, useState } from 'react';
import { LoadingScreen, FullScreen } from '@renderer/components';
import { Runtime } from '@renderer/util/runtime';
import { parseHtml } from '@renderer/util/parseHtml';
import { useInjectCss } from '@renderer/hooks';
import { Helmet } from 'react-helmet';

const { callMain } = window.bridge;

function useParseLayout() {
  const [node, setNode] = useState<ReactNode>();
  const config = Runtime.currentTheme?.config ?? null;

  useEffect(() => {
    (async () => {
      if (!config) {
        return;
      }
      const mainLayout = config.main.layout;
      const mainPath = await callMain('path-join', Runtime.currentTheme.path, mainLayout);
      const mainBuffer = await callMain('request-local-file', mainPath);
      const decoder = new TextDecoder();

      const htmlNode = await parseHtml(decoder.decode(mainBuffer));
      setNode(htmlNode);
    })();
  }, [config]);
  return node;
}

export const Index: FC = () => {
  const [ready, setReady] = useState(false);
  const node = useParseLayout();
  return (
    <>
      {!ready && <LoadingScreen switchToIndex={() => setReady(true)} />}
      {ready && <FullScreen>{node}</FullScreen>}
    </>
  );
};
