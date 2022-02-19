/**
 * Type definitions for <ThemeDir>/<ThemeName>/ThemeConfiguration.json
 */

export type Page = {
  layout: string;
  styleSheets?: string[];
};

export type ThemeConfigurationType = {
  main: Page;
  styleSheets?: string[];
};
