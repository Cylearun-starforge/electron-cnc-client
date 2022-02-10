import { Keys } from '@common/config/keys';
import type { ClientConfigurationType } from '@common/config/type';

export const getConfig = () =>
  JSON.parse(localStorage.getItem(Keys.clientConfiguration) ?? '{}') as ClientConfigurationType;
