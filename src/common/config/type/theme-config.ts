/**
 * Type definitions for <ThemeDir>/<ThemeName>/ThemeConfiguration.json
 */

export type Page = {
  layout: string;
  styleSheets?: string[];
};

export type ThemeConfigurationType = {
  main: Page;
  campaign: Page;
  styleSheets?: string[];
};
