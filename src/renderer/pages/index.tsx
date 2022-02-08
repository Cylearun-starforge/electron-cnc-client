import { FC, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
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
const toBase64 = async (buffer: Buffer) =>
  new Promise<string>(res => {
    const blob = new Blob([buffer]);
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.addEventListener('load', () => {
      res(reader.result as string);
    });
  });

const setLoadingScreenByConfig = async () => {
  const config = await callMain('get-configuration');
  const activeThemePath = await callMain('path-join', config.constants.ThemeDir, config.dynamic!.defaultTheme ?? '');
  const bgPath = await callMain('path-join', activeThemePath, './loadingscreen.png');
  const backgroundUrl = await callMain('request-local-file', bgPath).then(toBase64);
  let loadingNode: ReactNode;
  if (
    !config.dynamic ||
    !config.dynamic!.loading ||
    (!config.dynamic!.loading.text && !config.dynamic!.loading.image)
  ) {
    return {
      backgroundUrl,
      loadingNode,
    };
  }
  const { loading } = config.dynamic;

  if (loading.image) {
    const loadingImageUrl = await window.bridge
      .callMain('request-local-file', activeThemePath + '/' + loading.image)
      .then(toBase64);
    loadingNode = <img src={loadingImageUrl} alt={loading.text ?? 'loading'} style={loading.style} />;
  } else {
    loadingNode = <div style={loading.style}>{loading.text}</div>;
  }
  return {
    backgroundUrl,
    loadingNode,
  };
};

export const Index: FC = () => {
  const [bg, setBg] = useState('');
  const [loading, setLoading] = useState<ReactNode>('loading');
  useEffect(() => {
    setLoadingScreenByConfig().then(config => {
      setBg(config.backgroundUrl);
      if (config.loadingNode) {
        setLoading(config.loadingNode);
      }
    });
  }, []);
  return (
    <div>
      {loading}
      <Background src={bg} alt='loading' />
    </div>
  );
};
