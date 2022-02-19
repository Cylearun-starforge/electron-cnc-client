import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider, FollowMouseContext, FollowMouseElementInformation, GlobalStyleProvider } from '@renderer/contexts';
const follower = [] as FollowMouseElementInformation[];

ReactDOM.render(
  <StrictMode>
    <ThemeProvider>
      <GlobalStyleProvider>
        <FollowMouseContext.Provider value={follower}>
          <App />
        </FollowMouseContext.Provider>
      </GlobalStyleProvider>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root')
);
