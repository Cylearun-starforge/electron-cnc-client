import type { ClientConfigurationType } from '@common/config/type';
import type { DeepPartial } from '@common/utils';
import type { ConfigConstType } from '@main/config/const';
import { Keys } from '@common/config/keys';
export class Runtime {
  static config: DeepPartial<ClientConfigurationType>;
  static constants: ConfigConstType;
  static ready: Promise<void> = new Promise(() => {});

  static async init() {
    const fullConfig = await window.bridge.callMain('get-configuration');
    Runtime.config = fullConfig.dynamic;
    Runtime.constants = fullConfig.constants;
    Runtime.ready = Promise.resolve();
    if (!Runtime.config.main) {
      window.bridge.callMain(
        'close-app-on-error',
        `main field is not defined in ${Keys.clientConfiguration}`,
        `To start client, add ${Keys.clientConfiguration} in your client dir\n` +
          'see https://cylearun-starforge.github.io/electron-cnc-client/ClientConfiguration'
      );
    }
  }
}
