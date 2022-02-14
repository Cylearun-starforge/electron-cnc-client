import { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { useNavigate } from 'react-router';

export type LinkType = 'external-link' | 'client-link';

export type LinkButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { ['link-type']?: LinkType; link?: string };
export function LinkButton({ children, ...props }: LinkButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      {...props}
      onClick={e => {
        if (!props.link || !props['link-type']) {
          return;
        }
        if (props['link-type'] === 'external-link') {
          window.bridge.callMain('open-in-explorer', props.link);
          return;
        }
        navigate(props.link);
      }}
    >
      {children}
    </button>
  );
}
