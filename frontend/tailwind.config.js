module.exports = {
  mode: 'JIT',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'input-focus': '#0000ff',
        'input-background': '#eee',
        'input-error': '#fa0000',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
