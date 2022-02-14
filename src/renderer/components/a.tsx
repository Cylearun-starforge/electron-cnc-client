import { AnchorHTMLAttributes } from 'react';

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export const Anchor = ({ href, onClick, ...rest }: AnchorProps) => {
  return (
    <a
      href={href}
      {...rest}
      onClick={e => {
        if (!href) {
          return;
        }
        e.preventDefault();
        console.log('a onclick', e);
        window.bridge.callMain('open-in-explorer', href);
      }}
    />
  );
};
