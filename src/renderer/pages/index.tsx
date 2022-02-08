import { FC, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

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
  const config = await window.bridge.callMain('get-configuration');
  const bgPath = config.constants.ThemeDir + '/' + (config.dynamic!.defaultTheme ?? '') + '/loadingscreen.png';
  const backgroundUrl = await window.bridge.callMain('request-local-file', bgPath).then(toBase64);
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

  if (loading.text) {
    loadingNode = <div style={loading.style}>{loading.text}</div>;
  } else {
    loadingNode = <img src={loading.image} alt={loading.text ?? 'loading'} style={loading.style} />;
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
