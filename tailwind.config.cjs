/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0b1326',
        'on-background': '#dae2fd',
        'primary': '#d2bbff',
        'primary-container': '#7c3aed',
        'on-primary-container': '#ede0ff',
        'secondary': '#4cd7f6',
        'tertiary': '#4edea3',
        'error': '#ffb4ab',
        'surface-container': '#171f33',
        'surface-container-high': '#222a3d',
        'on-surface': '#dae2fd',
        'on-surface-variant': '#ccc3d8',
        'outline': '#958da1',
      },
    },
  },
  plugins: [],
}