import './app.css';
import { useFollowMouse, useStyle } from '@renderer/contexts';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Index } from '@renderer/pages';
import { useEffect, useState } from 'react';
import { moveFollower } from './util/follow-mouse';
import { Keys } from '@common/config/keys';
import { Helmet } from 'react-helmet';
import { ModalHost, PageContainer } from '@renderer/components';
import { Runtime } from './util/runtime';
import { Page } from '@common/config';

function App() {
  const follower = useFollowMouse();
  const [{ global, page }] = useStyle();
  const customPages = useCustomPage();

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
        <ModalHost />
        <Routes>
          <Route path='/' element={<Index />} />
          {customPages.map(p => (
            <Route
              path={`/${p.name}`}
              key={p.name}
              element={<PageContainer layout={p.layout} styleSheets={p.styleSheets} />}
            ></Route>
          ))}
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;

const validatePage = (name: string, page: Page): string | null => {
  const missing = [] as string[];
  const format = [] as string[];
  if (!page.layout) {
    missing.push('layout');
  } else if (typeof page.layout !== 'string') {
    format.push('layout');
  }

  if (page.styleSheets) {
    if (!Array.isArray(page.styleSheets)) {
      format.push('styleSheets');
    }
  }
  if (missing.length === 0 && format.length === 0) {
    return null;
  }
  let error = `Invalid page definition:\nname: ${name}\n`;
  if (missing.length) {
    error += `missing fields: ${missing.join(', ')}\n`;
  }
  if (format.length) {
    error += `fields with wrong format: ${format.join(', ')}\n`;
  }
  return error;
};

function useCustomPage() {
  const [customPages, setCustomPages] = useState<Array<{ name: string } & Page>>([]);
  useEffect(() => {
    Runtime.event.addEventListener('theme-loaded', () => {
      const pages = Runtime.currentTheme.config.pages;
      const settings: typeof customPages = [];
      for (const name in pages) {
        if (Object.prototype.hasOwnProperty.call(pages, name)) {
          const page = pages[name];
          const pageError = validatePage(name, page);
          if (pageError) {
            console.error(pageError);
            continue;
          }
          settings.push({
            name,
            layout: page.layout,
            styleSheets: page.styleSheets?.filter(p => typeof p === 'string'),
          });
        }
      }
      setCustomPages(settings);
    });
  }, []);
  return customPages;
}
