interface Doodle {
  emoji: string;
  top: string;
  left: string;
  size: string;
  rotate: string;
  anim: 'animate-twinkle' | 'animate-float';
  delay: string;
}

const DOODLES: Doodle[] = [
  { emoji: '💖', top: '6%', left: '4%', size: 'text-4xl', rotate: '-12deg', anim: 'animate-float', delay: '0s' },
  { emoji: '✨', top: '12%', left: '88%', size: 'text-3xl', rotate: '10deg', anim: 'animate-twinkle', delay: '0.5s' },
  { emoji: '⭐', top: '28%', left: '92%', size: 'text-2xl', rotate: '-6deg', anim: 'animate-twinkle', delay: '1.2s' },
  { emoji: '🎀', top: '46%', left: '3%', size: 'text-3xl', rotate: '8deg', anim: 'animate-float', delay: '0.8s' },
  { emoji: '⚡', top: '68%', left: '90%', size: 'text-3xl', rotate: '-14deg', anim: 'animate-float', delay: '1.5s' },
  { emoji: '✨', top: '80%', left: '6%', size: 'text-2xl', rotate: '5deg', anim: 'animate-twinkle', delay: '0.3s' },
  { emoji: '💫', top: '90%', left: '80%', size: 'text-3xl', rotate: '-8deg', anim: 'animate-twinkle', delay: '2s' },
  { emoji: '🌟', top: '4%', left: '48%', size: 'text-2xl', rotate: '12deg', anim: 'animate-twinkle', delay: '1s' },
  { emoji: '💕', top: '58%', left: '95%', size: 'text-2xl', rotate: '-10deg', anim: 'animate-float', delay: '2.4s' },
  { emoji: '⚡', top: '36%', left: '2%', size: 'text-2xl', rotate: '15deg', anim: 'animate-twinkle', delay: '1.8s' },
];

export function BackgroundDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      {DOODLES.map((d, i) => (
        <span
          key={i}
          className={`absolute ${d.size} ${d.anim} select-none opacity-40 dark:opacity-25`}
          style={
            {
              top: d.top,
              left: d.left,
              animationDelay: d.delay,
              ['--doodle-rotate' as string]: d.rotate,
            } as React.CSSProperties
          }
        >
          {d.emoji}
        </span>
      ))}
    </div>
  );
}
