/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors:{
            'background': '#fafafa',
            'primary': {
               DEFAULT: '#083344',
               50:  '#ECFEFF',
               100: '#cae1fa',
               200: '#A5F3FC',
               300: '#67E8F9',
               400: '#22D3EE',
               500: '#0891B2', // darker main accent
               600: '#0E7490',
               700: '#155E75',
               800: '#164E63',
               900: '#083344',
            },
            'secondary': '#D1D5D8',
            'primarydark': '#0054B3',
            'primarylight':'#cae1fa',
         }

      },
   },
   plugins: [],
};
