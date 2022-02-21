import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';
import { FollowMouseContext, FollowMouseElementInformation, StyleProvider } from '@renderer/contexts';
const follower = [] as FollowMouseElementInformation[];

ReactDOM.render(
  <StrictMode>
    <StyleProvider>
      <FollowMouseContext.Provider value={follower}>
        <App />
      </FollowMouseContext.Provider>
    </StyleProvider>
  </StrictMode>,
  document.getElementById('root')
);
