import { useTheme } from '@renderer/contexts';

export type VariableType = 'theme' | 'themePath' | 'username';
export type VariableTextProps = {
  var?: VariableType;
};

export function VariableText({ var: variableType }: VariableTextProps) {
  const [theme] = useTheme();
  if (variableType === 'username') {
    return 'test';
  }
  if (variableType === 'theme') {
    return theme.name;
  }
  return theme.path;
}
