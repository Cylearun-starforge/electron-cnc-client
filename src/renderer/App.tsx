import { useEffect, useState } from 'react';
import './App.css';
import { ThemeProvider } from '@renderer/contexts';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Index } from '@renderer/pages';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path={'/'} element={<Index />}>
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
