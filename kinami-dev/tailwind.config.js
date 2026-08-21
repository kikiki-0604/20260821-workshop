/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        rounded: ['"M PLUS Rounded 1c"', '"Hiragino Maru Gothic ProN"', 'sans-serif'],
        pop: ['"Hachi Maru Pop"', '"M PLUS Rounded 1c"', 'cursive'],
      },
      keyframes: {
        // Bake each doodle's own rotation in via a CSS custom property, since
        // an animated `transform` overrides any inline `transform` for the
        // whole animation duration (not just at keyframe boundaries).
        twinkle: {
          '0%, 100%': {
            opacity: '0.15',
            transform: 'scale(0.85) rotate(var(--doodle-rotate, 0deg))',
          },
          '50%': {
            opacity: '0.55',
            transform: 'scale(1.05) rotate(calc(var(--doodle-rotate, 0deg) + 8deg))',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(var(--doodle-rotate, 0deg))' },
          '50%': { transform: 'translateY(-8px) rotate(var(--doodle-rotate, 0deg))' },
        },
      },
      animation: {
        twinkle: 'twinkle 4s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
