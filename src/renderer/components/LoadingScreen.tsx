import { FC, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import { toBase64 } from '@common/utils';
import { useTheme } from '@renderer/contexts';
import { Runtime } from '@renderer/util/runtime';
import { useInjectCss } from '@renderer/hooks';

const { callMain } = window.bridge;
const Background = styled.img`
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  position: absolute;
  z-index: -10;
  object-fit: cover;
`;
type SwitchFunction = () => void;
export const LoadingScreen: FC<{
  switchToIndex: SwitchFunction;
}> = ({ switchToIndex }) => {
  const { background, loading } = useInit(switchToIndex);
  return (
    <div>
      {loading}
      <Background src={background} alt='loading' />
    </div>
  );
};

function useInit(switchToIndex: SwitchFunction) {
  const [background, setBg] = useState('');
  const [loading, setLoading] = useState<ReactNode>('loading');
  const [, setTheme] = useTheme();

  useInjectCss();

  useEffect(() => {
    setLoadingScreenByConfig().then(config => {
      const theme = {
        name: config.themeName,
        path: config.themePath,
      };
      setTheme(theme);
      setBg(config.backgroundUrl);
      if (config.loadingNode) {
        setLoading(config.loadingNode);
      }
      switchToIndex();
    });
  }, []);

  return {
    background,
    loading,
  };
}

async function setLoadingScreenByConfig() {
  await Runtime.init();
  const config = Runtime.config;
  const themeName = config.defaultTheme ?? '';
  const themePath = await callMain('path-join', Runtime.constants.ThemeDir, themeName);
  const bgPath = await callMain('path-join', themePath, './loadingscreen.png');
  const backgroundUrl =
    (await callMain('request-local-file', bgPath)
      .then(buffer => toBase64(new Blob([buffer])))
      .catch(() => {})) ?? '';
  let loadingNode: ReactNode;
  if (!config.loading || (!config.loading.text && !config.loading.image)) {
    return {
      backgroundUrl,
      loadingNode,
      themeName,
      themePath,
    };
  }
  const { loading } = config;

  if (loading.image) {
    const loadingImageUrl = await window.bridge
      .callMain('request-local-file', themePath + '/' + loading.image)
      .then(buffer => toBase64(new Blob([buffer])))
      .catch(() => {});
    loadingNode = <img src={loadingImageUrl ?? ''} alt={loading.text ?? 'loading'} className={loading.class} />;
  } else {
    loadingNode = <div className={loading.class}>{loading.text}</div>;
  }
  return {
    backgroundUrl,
    loadingNode,
    themeName,
    themePath,
  };
}
