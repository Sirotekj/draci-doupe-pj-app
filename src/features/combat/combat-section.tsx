import type { ReactNode } from 'react';
import { View } from 'react-native';

type CombatSectionProps = {
  children: ReactNode;
  className?: string;
};

export function CombatSection({ children, className }: CombatSectionProps) {
  return (
    <View
      className={[
        'gap-4 rounded border border-yellow/30 bg-card/70 p-medium',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </View>
  );
}
