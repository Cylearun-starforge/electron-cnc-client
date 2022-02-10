import './App.css';
import { useFollowMouse, useStyleContext } from '@renderer/contexts';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Index } from '@renderer/pages';
import { useEffect } from 'react';
import { moveFollower } from './util/followMouse';
import { Keys } from '@common/config/keys';
import { Helmet } from 'react-helmet';

function App() {
  const follower = useFollowMouse();
  const [cssNodes] = useStyleContext();

  useEffect(() => {
    document.body.addEventListener('mousemove', e => {
      console.log(e.x, e.y);
      follower.forEach(fo => {
        moveFollower(e, fo);
      });
    });
  }, []);

  useEffect(() => {
    window.bridge.callMain('get-configuration').then(config => {
      localStorage.setItem(Keys.clientConfiguration, JSON.stringify(config.dynamic));
    });
  }, []);
  return (
    <>
      <HashRouter>
        <Helmet>
          {cssNodes.map(css => (
            <link rel='stylesheet' key={css} href={css}></link>
          ))}
        </Helmet>
        <Routes>
          <Route path='/' element={<Index />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
