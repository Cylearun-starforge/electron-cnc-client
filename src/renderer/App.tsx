import './App.css';
import { ThemeProvider, FollowMouseContext, FollowMouseElementInformation } from '@renderer/contexts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Index } from '@renderer/pages';
import { useEffect } from 'react';
import { moveFollower } from './util/followMouse';
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
  return (
    <ThemeProvider>
      <FollowMouseContext.Provider value={follower}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Index />} />
          </Routes>
        </BrowserRouter>
      </FollowMouseContext.Provider>
    </ThemeProvider>
  );
}

export default App;
