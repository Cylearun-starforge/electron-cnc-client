import { FC, ReactNode, useEffect, useState } from 'react';
import { randomString, toBase64 } from '@common/utils';
import { useFollowMouse, useTheme } from '@renderer/contexts';
import { LoadingScreen, FullScreen } from '@renderer/components';
import { Runtime } from '@renderer/util/runtime';

const { callMain } = window.bridge;

function useInit() {
  const followers = useFollowMouse();
  const [background, setBackground] = useState<ReactNode[]>([]);
  const [theme] = useTheme();
  const config = Runtime.config;
  useEffect(() => {
    if (!config) {
      return;
    }
    const main = config.main!;

    const backgroundNodes = [] as ReactNode[];
    const backgroundCount = main.background?.length ?? 0;
    const backgroundRequests = (main.background ?? []).map(async (bg, i) => {
      const path = await callMain('path-join', theme.path, bg?.image ?? '');
      const buffer = await callMain('request-local-file', path);
      const url = await toBase64(new Blob([buffer]));

      let id: string | undefined;
      if (bg?.followMouse) {
        id = randomString();
        followers.push({
          config: bg.followMouse,
          elementId: id,
        });
      }
      const node = (
        <img alt='' src={url} id={id} key={i} style={{ zIndex: i - backgroundCount }} className={bg?.class} />
      );
      backgroundNodes.push(node);
    });

    Promise.allSettled(backgroundRequests).then(result => {
      setBackground(backgroundNodes);
    });
  }, [config]);

  return {
    background,
  };
}

export const Index: FC = () => {
  const [ready, setReady] = useState(false);
  const { background: bgNodes } = useInit();

  return (
    <>
      {!ready && <LoadingScreen switchToIndex={() => setReady(true)} />}
      {ready && <FullScreen>{bgNodes}</FullScreen>}
    </>
  );
};
