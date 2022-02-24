import { FC, ReactNode, useEffect, useState } from 'react';
import { FullScreen } from '@renderer/components';
import { Runtime } from '@renderer/util/runtime';
import { parseHtml } from '@renderer/util/parse-html';
import { parseCss } from '@renderer/util/parse-css';
import { useStyle } from '@renderer/contexts';

const { callMain } = window.bridge;

function useParseLayout() {
  const [node, setNode] = useState<ReactNode>();
  const config = Runtime.currentTheme?.config ?? null;
  const [, { setPage }] = useStyle();
  useEffect(() => {
    (async () => {
      if (!config) {
        return;
      }
      const campaignStyle = parseCss(config.campaign.styleSheets ?? []);
      const campaignLayout = config.campaign.layout;
      const campaignPath = await callMain('path-join', Runtime.currentTheme.path, campaignLayout);
      const buffer = await callMain('request-local-file', campaignPath);
      const decoder = new TextDecoder();

      const htmlNode = await parseHtml(decoder.decode(buffer));
      const css = await campaignStyle;
      setPage(css);
      setNode(htmlNode);
    })();
  }, [config]);
  return node;
}

export const CampaignPage: FC = () => {
  const node = useParseLayout();
  return <FullScreen>{node}</FullScreen>;
};
