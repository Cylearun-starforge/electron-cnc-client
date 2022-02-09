import './App.css';
import { ThemeProvider } from '@renderer/contexts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Index } from '@renderer/pages';
import { Client } from './pages/client';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/client' element={<Client />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
