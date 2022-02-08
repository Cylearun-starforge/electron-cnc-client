import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

const Background = styled.div<{ backgroundImage: string }>`
  background-image: url('${props => props.backgroundImage}');
  background-position: center;
  background-size: 100% 100%;
  width: 100vw;
  height: 100vh;
`;
export const Index: FC = () => {
  const [bg, setBg] = useState('');

  useEffect(() => {
    window.bridge.onConfigChange(async config => {
      console.log(config);
      const backgroundUrl =
        window.bridge.getConfigConstants().ThemeDir + '/' + config.defaultTheme + '/loadingscreen.png';
      window.bridge.requestLocalFile(backgroundUrl).then(data => {
        console.log('first 40', data.slice(0, 40))
        const blob = new Blob([data]);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.addEventListener('load', () => {
          setBg(reader.result as string);
        });
      });
    });
  }, []);
  return <Background backgroundImage={bg} />;
};
