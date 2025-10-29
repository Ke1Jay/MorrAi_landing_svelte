/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['DM Sans', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2cb981',
          dark: '#2a9d53',
          bg: '#152320',
        },
        bg: {
          primary: '#141718',
          secondary: '#1a1d1e',
          tertiary: '#2a2d2e',
        }
      },
      backgroundColor: {
        'primary': '#2cb981',
        'primary-dark': '#2a9d53',
        'primary-bg': '#152320',
        'bg-primary': '#141718',
        'bg-secondary': '#1a1d1e',
        'bg-tertiary': '#2a2d2e',
      },
      textColor: {
        'primary': '#2cb981',
        'primary-dark': '#2a9d53',
      },
      borderColor: {
        'primary': '#2cb981',
        'primary-dark': '#2a9d53',
      }
    }
  },
  plugins: []
}

