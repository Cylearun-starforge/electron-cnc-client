import { ReactNode } from 'react';

type ModalData = {
  layout: ReactNode;
  //   meta: { filename: string };
};

export class ModalManager {
  #modals: Map<string, ModalData> = new Map();
  #current: string | null = null;
  #event: EventTarget = new EventTarget();

  register(id: string, layout: ReactNode) {
    if (this.#modals.has(id)) {
      console.error('Modal ' + id + ' has been registered');
    }
    this.#modals.set(id, { layout });
  }

  open(id: string) {
    if (this.#modals.has(id)) {
      console.error('Modal ' + id + ' not found');
    }
    this.#current = id;
    this.#event.dispatchEvent(new Event('onChangeModal'));
  }

  close() {
    if (this.#current) {
      this.#current = null;
      this.#event.dispatchEvent(new Event('onChangeModal'));
    }
  }

  unrigister(id: string) {
    if (!id) {
      return;
    }
    this.close();
    this.#modals.delete(id);
  }

  addChangeModalListener(action: (modal: ReactNode | null) => void) {
    this.#event.addEventListener('onChangeModal', e => {
      const modal = this.#current ? this.#modals.get(this.#current) ?? null : null;
      action(modal?.layout ?? null);
    });
  }
}
