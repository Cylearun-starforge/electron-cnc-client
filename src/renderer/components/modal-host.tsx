import styled from 'styled-components';
import { ReactNode, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Runtime } from '@renderer/util/runtime';

const ModalWrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 9999;
`;

export function ModalHost() {
  const [modal, setModal] = useState<ReactNode>(null);
  useEffect(() => {
    Runtime.modals.addChangeModalListener(modal => {
      setModal(modal);
    });
  }, []);
  const wrapper = modal ? (
    <ModalWrapper
      onClick={e => {
        console.log(e);
      }}
    >
      {modal}
    </ModalWrapper>
  ) : null;
  return createPortal(wrapper, document.querySelector('#modal-root')!);
}
