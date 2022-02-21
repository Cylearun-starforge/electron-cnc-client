import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import { FollowMouseContext, FollowMouseElementInformation, GlobalStyleProvider } from '@renderer/contexts';
const follower = [] as FollowMouseElementInformation[];

ReactDOM.render(
  <StrictMode>
    <GlobalStyleProvider>
      <FollowMouseContext.Provider value={follower}>
        <App />
      </FollowMouseContext.Provider>
    </GlobalStyleProvider>
  </StrictMode>,
  document.getElementById('root')
);
