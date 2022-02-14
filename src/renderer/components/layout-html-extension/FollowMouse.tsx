import { FollowMouseMoveProperties } from '@common/config/type';
import { randomString } from '@common/utils';
import { useFollowMouse } from '@renderer/contexts';
import { ReactNode, useEffect, useRef, useState } from 'react';

export type FollowMouseProps = {
  'speed-x'?: number;
  'speed-y'?: number;
  'offset-x'?: number;
  'offset-y'?: number;
  'base-x'?: string;
  'base-y'?: string;
  'max-move-top'?: number;
  'max-move-bottom'?: number;
  'max-move-left'?: number;
  'max-move-right'?: number;
  'z-index'?: string;
  children: ReactNode;
};

const BaseX = ['left', 'right'] as const;
const BaseY = ['top', 'bottom'] as const;

const parseAndCheck = (
  value: any,
  fallback: number,
  parse: typeof parseInt = parseInt,
  check?: (value: number) => boolean
) => {
  const t = typeof value;
  if (t !== 'number' && t !== 'string') {
    return fallback;
  }
  const p = t === 'string' ? parse(value, 10) : (value as number);
  if (isNaN(p)) {
    return fallback;
  }
  if (check) {
    return check(p) ? p : fallback;
  }
  return p;
};

export function FollowMouse({ children, ...props }: FollowMouseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [id] = useState(randomString());
  const followers = useFollowMouse();
  const baseX = props['base-x'] ?? 'left';
  const baseY = props['base-y'] ?? 'top';
  const config: FollowMouseMoveProperties = {
    base: {
      x: BaseX.includes(baseX as any) ? (baseX as any) : 'left',
      y: BaseY.includes(baseY as any) ? (baseY as any) : 'top',
    },
    maxMove: {
      bottom: parseAndCheck(props['max-move-bottom'], 0),
      top: parseAndCheck(props['max-move-top'], 0),
      left: parseAndCheck(props['max-move-left'], 0),
      right: parseAndCheck(props['max-move-right'], 0),
    },
    offset: {
      x: parseAndCheck(props['offset-x'], 0),
      y: parseAndCheck(props['offset-y'], 0),
    },
    speed: {
      x: parseAndCheck(props['speed-x'], 1, parseFloat),
      y: parseAndCheck(props['speed-y'], 1, parseFloat),
    },
  };
  const zIndex = parseAndCheck(props['z-index'], 0);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    followers.push({
      config,
      element: ref,
      id: id,
    });
    return () => {
      const index = followers.findIndex(fo => fo.id === id);
      if (index !== -1) {
        followers.splice(index, 1);
      }
    };
  }, []);
  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        zIndex,
      }}
    >
      {children}
    </div>
  );
}
