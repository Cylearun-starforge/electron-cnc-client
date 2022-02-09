import { FC, ReactNode, useState } from 'react';
import { randomString, toBase64 } from '@common/utils';
import { FollowMouseElementInformation, ThemeType, useFollowMouse } from '@renderer/contexts';
import { Keys } from '@common/config/keys';
import { LoadingScreen, FullScreen } from '@renderer/components';

const { callMain } = window.bridge;
type ClientProps = {
  background: ReactNode[];
  followMouseInfo: FollowMouseElementInformation[];
};
async function prepareClientMainUI(theme: ThemeType): Promise<ClientProps> {
  const background = [] as ReactNode[];
  const followMouseInfo = [] as FollowMouseElementInformation[];

  const config = await callMain('get-configuration');
  const { main } = config.dynamic;
  if (!main) {
    callMain(
      'close-app-on-error',
      `main field is not defined in ${Keys.clientConfiguration}`,
      `To start client, add ${Keys.clientConfiguration} in your client dir\n` +
        'see https://cylearun-starforge.github.io/electron-cnc-client/ClientConfiguration'
    );
    return {
      background,
      followMouseInfo,
    };
  }

  const backgroundCount = main.background?.length ?? 0;
  const backgroundRequests = (main.background ?? []).map(async (bg, i) => {
    const path = await callMain('path-join', theme.path, bg?.image ?? '');
    const buffer = await callMain('request-local-file', path);
    const url = await toBase64(new Blob([buffer]));
    const backgroundStyle = Object.assign({}, bg?.style ?? {}, { zIndex: i - backgroundCount });

    let id: string | undefined;
    if (bg?.followMouse) {
      id = randomString();
      followMouseInfo.push({
        config: bg.followMouse,
        elementId: id,
      });
      console.log('follower added');
    }
    const node = (
      <img src={url} id={id} alt={`background-[${i - backgroundCount}]`} key={i} style={backgroundStyle}></img>
    );
    background.push(node);
  });

  await Promise.allSettled(backgroundRequests);

  return {
    background,
    followMouseInfo,
  };
}

export const Index: FC = () => {
  const [ready, setReady] = useState(false);
  const [bgNodes, setBgNodes] = useState<ClientProps['background']>([]);
  const followers = useFollowMouse();
  const onThemeReady = (theme: ThemeType) => {
    prepareClientMainUI(theme).then(props => {
      setBgNodes(props.background);
      followers.push(...props.followMouseInfo);
      setReady(true);
    });
  };
  return (
    <>
      {!ready && <LoadingScreen onReady={onThemeReady} />}
      {ready && <FullScreen>{bgNodes}</FullScreen>}
    </>
  );
};
