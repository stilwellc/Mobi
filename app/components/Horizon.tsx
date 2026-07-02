import React from 'react';

type HorizonVariant = 'gold' | 'ocean' | 'sunset';

const gradients: Record<HorizonVariant, string> = {
  gold: 'linear-gradient(90deg, transparent, var(--color-accent-gold) 30%, var(--color-accent-gold) 70%, transparent)',
  ocean: 'linear-gradient(90deg, transparent, var(--color-accent-ocean) 30%, var(--color-accent-ocean) 70%, transparent)',
  sunset: 'linear-gradient(90deg, transparent, var(--color-accent-coral) 25%, var(--color-accent-gold) 70%, transparent)',
};

export default function Horizon({
  variant = 'gold',
  style,
}: {
  variant?: HorizonVariant;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        height: 1,
        width: '100%',
        background: gradients[variant],
        opacity: 0.35,
        ...style,
      }}
    />
  );
}
