/**
 * Type definitions for <ThemeDir>/<ThemeName>/ThemeConfiguration.json
 */

import { DeepPartial } from '@common/utils';

export type Page = {
  layout: string;
  styleSheets: string[];
  name: string;
};

export type ThemeConfigurationType = DeepPartial<{
  pages: Page[];
  styleSheets: string[];
}>;
