import { Runtime } from '@renderer/util/runtime';
import { ReactNode, useEffect } from 'react';

export type ModalPageProps = {
  ['modal-id']?: string;
  children?: ReactNode;
};

export function ModalPage({ children, ...props }: ModalPageProps) {
  const id = props['modal-id'];
  useEffect(() => {
    console.log('modal-page id', id);
    if (!id) {
      console.error('Modal should has modal-id property');
      return () => {};
    }
    console.log('register', Runtime.modals);
    Runtime.modals.register(id, children);
    return () => {
      Runtime.modals.unrigister(id);
    };
  }, [id, children]);
  console.log('modal', props);
  return '';
}
