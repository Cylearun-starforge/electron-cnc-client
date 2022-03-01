/**
 * Type definitions for <ThemeDir>/<ThemeName>/ThemeConfiguration.json
 */

export type Page = {
  layout: string;
  styleSheets?: string[];
};

export type ThemeConfigurationType = {
  index: Page;
  pages: Record<string, Page>;
  styleSheets?: string[];
};
