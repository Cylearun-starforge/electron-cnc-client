import './app.css';
import { useFollowMouse, useStyle } from '@renderer/contexts';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Index } from '@renderer/pages';
import { useEffect } from 'react';
import { moveFollower } from './util/follow-mouse';
import { Keys } from '@common/config/keys';
import { Helmet } from 'react-helmet';
import { CampaignPage } from './pages/campaign';

function App() {
  const follower = useFollowMouse();
  const [{ global, page }] = useStyle();

  useEffect(() => {
    document.body.addEventListener('mousemove', e => {
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
          {global.map(css => (
            <style key={css}>{css}</style>
          ))}
          {page.map(css => (
            <style key={css}>{css}</style>
          ))}
        </Helmet>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/campaign' element={<CampaignPage />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
