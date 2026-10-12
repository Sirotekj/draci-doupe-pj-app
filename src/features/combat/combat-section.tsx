import type { ReactNode } from 'react';
import { View } from 'react-native';

type CombatSectionProps = {
  children: ReactNode;
  className?: string;
};

export function CombatSection({ children, className }: CombatSectionProps) {
  const sectionClassName = className
    ? `pb-medium gap-4 border-b border-yellow ${className}`
    : 'pb-medium gap-4 border-b border-yellow';

  return <View className={sectionClassName}>{children}</View>;
}
