import './App.css';
import { ThemeProvider, FollowMouseContext, FollowMouseElementInformation } from '@renderer/contexts';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Index } from '@renderer/pages';
import { useEffect } from 'react';
import { moveFollower } from './util/followMouse';
import { Keys } from '@common/config/keys';
const follower = [] as FollowMouseElementInformation[];
function App() {
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
    <ThemeProvider>
      <FollowMouseContext.Provider value={follower}>
        <HashRouter>
          <Routes>
            <Route path='/' element={<Index />} />
          </Routes>
        </HashRouter>
      </FollowMouseContext.Provider>
    </ThemeProvider>
  );
}

export default App;
