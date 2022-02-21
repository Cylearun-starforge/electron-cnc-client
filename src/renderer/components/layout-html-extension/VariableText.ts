import { Runtime } from '@renderer/util/runtime';

export type VariableType = 'theme' | 'themePath' | 'username';
export type VariableTextProps = {
  var?: VariableType;
};

export function VariableText({ var: variableType }: VariableTextProps) {
  if (variableType === 'username') {
    return 'test';
  }
  if (variableType === 'theme') {
    return Runtime.currentTheme.name;
  }
  return Runtime.currentTheme.path;
}
