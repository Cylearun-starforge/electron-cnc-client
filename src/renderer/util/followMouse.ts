import { FollowMouseMoveProperties } from '@common/config/type';
import { DeepPartial } from '@common/utils';
import { FollowMouseElementInformation } from '@renderer/contexts';

export const checkFollowMouseProps = (props: DeepPartial<FollowMouseMoveProperties>) => {
  if (!props || !props.speed || !props.speed.x || !props.speed.y) {
    return false;
  }
  if (
    !props.maxMove ||
    props.maxMove.bottom === undefined ||
    props.maxMove.top === undefined ||
    props.maxMove.left === undefined ||
    props.maxMove.right === undefined
  ) {
    return false;
  }
  return true;
};
function fallback<TBase = string, TCandidate = NonNullable<TBase>>(
  candidate: TBase,
  allow: TCandidate[],
  fallback: TCandidate
) {
  if (candidate === null || candidate === undefined) {
    return fallback;
  }

  return allow.includes(candidate as any) ? candidate : fallback;
}
export function moveFollower(event: MouseEvent, follower: FollowMouseElementInformation) {
  const element = follower.element.current;
  if (!element) {
    return;
  }
  const config = follower.config;

  const offsetX = config.offset?.x ?? 0;
  const offsetY = config.offset?.y ?? 0;

  const baseX = fallback(config.base?.x, ['left', 'right'], 'left') as 'left' | 'right';
  const baseY = fallback(config.base?.y, ['top', 'bottom'], 'bottom') as 'top' | 'bottom';

  const rateX = config.speed?.x ?? 1;
  const rateY = config.speed?.y ?? 1;

  const limits = {
    left: config.maxMove?.left ?? -Infinity,
    right: config.maxMove?.right ?? Infinity,
    top: config.maxMove?.top ?? -Infinity,
    bottom: config.maxMove?.bottom ?? Infinity,
  };

  const mouseOffsetX = event.clientX - document.body.clientWidth / 2;
  const mouseOffsetY = event.clientY - document.body.clientHeight / 2;
  let moveX = mouseOffsetX * rateX;
  let moveY = mouseOffsetY * rateY;

  if (moveX < 0 && limits.left < -moveX) {
    moveX = -limits.left;
  } else if (moveX > 0 && limits.right < moveX) {
    moveX = limits.right;
  }

  if (moveY < 0 && limits.top < -moveY) {
    moveY = -limits.top;
  } else if (moveY > 0 && limits.bottom < moveY) {
    moveY = limits.bottom;
  }

  const positionX = offsetX + moveX + (document.body.clientWidth - element.clientWidth) / 2;
  const positionY = offsetY + moveY - (document.body.clientHeight - element.clientHeight) / 2;

  element.style[baseX] = `${positionX}px`;
  element.style[baseY] = `${positionY}px`;
}
