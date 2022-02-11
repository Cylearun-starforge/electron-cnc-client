import { FC, ReactNode, useEffect, useState } from 'react';
import { toBase64 } from '@common/utils';
import { useTheme } from '@renderer/contexts';
import { LoadingScreen, FullScreen } from '@renderer/components';
import { Runtime } from '@renderer/util/runtime';
import { loadFile } from '@renderer/util/polyfill';
import { parseHtml } from '@renderer/util/parseHtml';

const { callMain } = window.bridge;

function useCarousel() {
  const [carousel, setCarousel] = useState<ReactNode>();
  const [theme] = useTheme();
  const config = Runtime.config;

  useEffect(() => {
    (async () => {
      if (!config) {
        return;
      }
      const main = config.main!;
      const enabled = config.features?.includes('carousel') ?? false;
      if (!enabled || !main.carousel) {
        return;
      }

      const auto = !!main.carousel.auto;
      let maskPath: string | undefined;
      try {
        maskPath = main.carousel.mask
          ? await loadFile(await callMain('path-join', theme.path, main.carousel.mask))
          : undefined;
      } catch (err) {}
      const contentLoadRequest = (main.carousel.content ?? []).map(async content => {
        const path = await callMain('path-join', theme.path, content?.image ?? '').then(p => loadFile(p));
        return {
          path,
          href: content?.href,
          class: content?.class,
        };
      });

      const contents = (await Promise.allSettled(contentLoadRequest))
        .filter(result => result.status === 'fulfilled')
        .map(r => {
          if (r.status === 'fulfilled') {
            return r.value;
          }
          return r.reason;
        });

      // setCarousel(<Carousel contents={contents} className={main.carousel.class} mask={maskPath} auto={auto} />);
    })();
  }, [config, theme]);
  return carousel;
}

function useInit() {
  // const followers = useFollowMouse();
  const [background, setBackground] = useState<ReactNode[]>([]);
  const [theme] = useTheme();
  const carousel = useCarousel();

  const config = Runtime.config;
  useEffect(() => {
    if (!config) {
      return;
    }
    const main = config.main!;

    const backgroundNodes = [] as ReactNode[];
    const backgroundCount = main.background?.length ?? 0;
    const backgroundRequests = (main.background ?? []).map(async (bg, i) => {
      const path = await callMain('path-join', theme.path, bg?.image ?? '');
      const buffer = await callMain('request-local-file', path);
      const url = await toBase64(new Blob([buffer]));

      let id: string | undefined;
      // if (bg?.followMouse) {
      //   id = randomString();
      //   followers.push({
      //     config: bg.followMouse,
      //     elementId: id,
      //   });
      // }
      const node = (
        <img alt='' src={url} id={id} key={i} style={{ zIndex: i - backgroundCount }} className={bg?.class} />
      );
      backgroundNodes.push(node);
    });

    Promise.allSettled(backgroundRequests).then(result => {
      setBackground(backgroundNodes);
    });
  }, [config]);

  return {
    background,
    carousel,
  };
}

function useParseHtml() {
  const [node, setNode] = useState<ReactNode>();
  const [theme] = useTheme();
  const config = Runtime.config;
  useEffect(() => {
    (async () => {
      if (!config) {
        return;
      }

      const mainLayout = config.main!;
      const mainPath = await callMain('path-join', theme.path, mainLayout);
      const mainBuffer = await callMain('request-local-file', mainPath);
      const decoder = new TextDecoder();

      const htmlNode = await parseHtml(decoder.decode(mainBuffer));
      setNode(htmlNode);
    })();
  }, [theme, config]);
  return node;
}

export const Index: FC = () => {
  const [ready, setReady] = useState(false);
  // const { background: bgNodes, carousel } = useInit();
  const node = useParseHtml();
  return (
    <>
      {!ready && <LoadingScreen switchToIndex={() => setReady(true)} />}
      {ready && <FullScreen>{node}</FullScreen>}
    </>
  );
};
