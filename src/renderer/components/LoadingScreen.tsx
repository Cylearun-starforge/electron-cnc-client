import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { toBase64 } from '@common/utils';
import { ThemeType, useTheme } from '@renderer/contexts';

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

const setLoadingScreenByConfig = async () => {
  const config = await callMain('get-configuration');
  const themePath = await callMain('path-join', config.constants.ThemeDir, config.dynamic.defaultTheme ?? '');
  const themeName = config.dynamic.defaultTheme ?? '';
  const bgPath = await callMain('path-join', themePath, './loadingscreen.png');
  const backgroundUrl =
    (await callMain('request-local-file', bgPath)
      .then(buffer => toBase64(new Blob([buffer])))
      .catch(() => {})) ?? '';
  let loadingNode: ReactNode;
  if (!config.dynamic.loading || (!config.dynamic.loading.text && !config.dynamic.loading.image)) {
    return {
      backgroundUrl,
      loadingNode,
      themeName,
      themePath,
    };
  }
  const { loading } = config.dynamic;

  if (loading.image) {
    const loadingImageUrl = await window.bridge
      .callMain('request-local-file', themePath + '/' + loading.image)
      .then(buffer => toBase64(new Blob([buffer])))
      .catch(() => {});
    loadingNode = <img src={loadingImageUrl ?? ''} alt={loading.text ?? 'loading'} style={loading.style} />;
  } else {
    loadingNode = <div style={loading.style}>{loading.text}</div>;
  }
  return {
    backgroundUrl,
    loadingNode,
    themeName,
    themePath,
  };
};

export const LoadingScreen: FC<{
  onReady: (theme: ThemeType) => void;
}> = ({ onReady }) => {
  const [bg, setBg] = useState('');
  const [loading, setLoading] = useState<ReactNode>('loading');
  const [, setTheme] = useTheme();
  const ref = useRef<HTMLDivElement>(null);
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
      onReady(theme);
    });
  }, []);
  return (
    <div ref={ref}>
      {loading}
      <Background src={bg} alt='loading' />
    </div>
  );
};
