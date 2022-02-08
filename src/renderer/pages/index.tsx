import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

const Background = styled.img`
  width: 100vw;
  height: 100vh;
  position: absolute;
  object-fic: cover;
`;
export const Index: FC = () => {
  const [bg, setBg] = useState('');

  useEffect(() => {
    (async () => {
      const config = await window.bridge.callMain('get-configuration');
      const backgroundUrl =
        config.constants.ThemeDir + '/' + (config.dynamic!.defaultTheme ?? '') + '/loadingscreen.png';
      console.log(backgroundUrl)
      window.bridge.callMain('request-local-file', backgroundUrl).then(data => {
        const blob = new Blob([data]);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.addEventListener('load', () => {
          setBg(reader.result as string);
        });
      });
    })();
  }, []);
  return (
    <div>
      <Background src={bg} alt='loading' />
    </div>
  );
};
