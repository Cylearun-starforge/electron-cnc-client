import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { ThemeProvider, FollowMouseContext, FollowMouseElementInformation, StyleProvider } from '@renderer/contexts';
const follower = [] as FollowMouseElementInformation[];

ReactDOM.render(
  <StrictMode>
    <ThemeProvider>
      <StyleProvider>
        <FollowMouseContext.Provider value={follower}>
          <App />
        </FollowMouseContext.Provider>
      </StyleProvider>
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root')
);
