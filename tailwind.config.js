/** @type {import('tailwindcss').Config} */
export default {
  // Use class strategy so you can toggle dark mode by adding the `dark` class to <html> or <body>
  darkMode: 'class',

  // Ensure Tailwind scans all relevant files for utility classes
  content: ['./index.html', './public/**/*.html', './src/**/*.{js,ts,jsx,tsx,html}'],

  theme: {
    extend: {
      // Semantic colors mapped to CSS variables so theme switching can be done at runtime
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        muted: 'var(--muted)',
        'muted-2': 'var(--muted-2)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)'
        },
        success: 'var(--color-success)',
        danger: 'var(--color-danger)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)'
      },

      // Smooth theme transition support
      transitionProperty: {
        theme: 'background-color, border-color, color, fill, stroke, box-shadow'
      }
    }
  },

  plugins: [
    // Utility that applies optimized transition settings for theme changes
    function ({ addUtilities }) {
      addUtilities({
        '.theme-transition': {
          transitionProperty: 'background-color, border-color, color, fill, stroke, box-shadow',
          transitionTimingFunction: 'ease-in-out',
          transitionDuration: '300ms'
        }
      });
    }
  ]
};
