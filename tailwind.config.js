/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        primary: '#8681FB',
        black: '#000000',
        gray: '#6B6D6E',
        secondary: '#F5F8FF',
        WHITE: '#ffffff',
        accent: '#FF006E',
        light: '#c7c7c8',
        grayPro: {
          100: '#E6E7E7', // Cloud Mist
          200: '#D0D1D1', // Soft Ash
          300: '#AFB1B1', // Silver Fog
          400: '#878989', // Urban Grey
          500: '#6B6D6E', // Steel Grey
          600: '#5C5E5E', // Graphite Stone
          700: '#4E5050', // Charcoal Slate
          800: '#444546', // Deep Carbon
        },
        // Brand Specific Colors from the image
        brand: {
          orange: '#FFD7C2', // Main course card background
          yellow: '#FFF4D6', // Lesson 1 background
          blue: '#E3F2FF', // Lesson 2 background
          purple: '#EBE9FF', // Lesson 3 background
          pink: '#FFE5F1', // Lesson 4 background
        },
      },
    },
  },
  plugins: [],
};
