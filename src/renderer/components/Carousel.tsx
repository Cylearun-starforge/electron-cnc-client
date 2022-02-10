import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div<{ mask?: string }>`
  -webkit-mask-image: url(${props => props.mask});
`;

const Dot = styled.div<{ active: boolean }>`
  background: white;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  opacity: ${props => (props.active ? '1' : '0.6')};

  &:hover {
    opacity: ${props => (props.active ? '1' : '0.8')};
    transition: ease-linear;
  }
`;
export type CarouselProps = {
  className?: string;
  contents: Array<{
    path: string;
    href?: string;
    class?: string;
  }>;
  mask?: string;
  auto: boolean;
};

export function Carousel({ contents, className, mask }: CarouselProps) {
  const [active, setActive] = useState(0);
  return (
    <Container className={className} mask={mask}>
      {contents.map((v, i) => (
        <a
          key={v.path}
          href={v.href}
          onClick={e => {
            e.preventDefault();
            if (v.href) {
              window.bridge.callMain('open-in-explorer', v.href);
            }
          }}
          className={v.class}
          style={{ display: active === i ? 'block' : 'none' }}
        >
          <img
            alt=''
            src={v.path}
            style={{
              objectFit: 'contain',
            }}
          />
        </a>
      ))}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
          bottom: 50,
          left: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '50%',
            justifyContent: 'space-evenly',
            padding: '12px 0',
            zIndex: '10',
          }}
        >
          {contents.map((_, i) => (
            <Dot
              active={active === i}
              key={i}
              onClick={e => {
                setActive(i);
              }}
            ></Dot>
          ))}
        </div>
      </div>
    </Container>
  );
}
