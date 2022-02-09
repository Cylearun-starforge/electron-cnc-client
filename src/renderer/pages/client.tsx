import { FC, ReactNode, useEffect, useState } from 'react';
import { toBase64 } from '@common/utils';
import { FullScreen } from '@renderer/components/FullScreen';

const { callMain } = window.bridge;

const setClientConfig = async () => {
  const config = await callMain('get-configuration');
  const activeThemePath = await callMain('path-join', config.constants.ThemeDir, config.dynamic!.defaultTheme ?? '');
  const backgroundNodes = [] as ReactNode[];
  const backgroundCount = config.dynamic.main?.background?.length ?? 0;
  const backgroundRequests =
    config.dynamic.main?.background?.map(async (bg, i) => {
      const path = await callMain('path-join', activeThemePath, bg?.image ?? '');
      const buffer = await callMain('request-local-file', path);
      const url = await toBase64(new Blob([buffer]));
      const backgroundStyle = Object.assign({}, bg?.style ?? {}, { zIndex: i - backgroundCount });
      backgroundNodes.push(<img src={url} alt={`background-[${i - backgroundCount}]`} key={i} style={backgroundStyle}></img>);
    }) ?? [];

  await Promise.allSettled(backgroundRequests);

  return {
    backgroundNodes,
  };
};
export const Client: FC = () => {
  const [bgNodes, setBgNodes] = useState([] as ReactNode[]);
  useEffect(() => {
    setClientConfig().then(config => {
      setBgNodes(config.backgroundNodes);
    });
  }, []);
  return <FullScreen>{bgNodes}</FullScreen>;
};
