/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors")

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '333px',
      'mmsm': '360px',
      'msm': '435px',
      'smm': '518px',
      'dsm': '550px',
      'sm': '640px',
      'sm10': '650px',
      'smd': '705px',
      'md': '768px',
      'mlg': '800px',
      'smlg': '950px',
      'lg': '1024px',
      'plg': '1135px',
      'mplg': '1216px',
      'mxl': '1335px',
      'xl': '1280px',
      'bxl': '1380px',
      '2xl': '1536px',
      '2mxl': '1600px',
      '3xl': '1686px',
    },
    extend: {
      keyframes: {
        ring: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' }
        }
      },
      animation: {
        ring: 'ring .5s ease-in-out',
      },
      colors: {
        "delete-red": "#d72222",
        "primary-blue": "#1967D2",
        "secondary-blue": "#E7EDF9",
        "primary-dark-blue": "#202124",
        "primary-gray": "#696969",
        "secondary-gray": "#ECEDF2",
        "tertiary-gray": "#77838f",
        "primary-black": "#202124",
        "primary-white": "#F5F6FB",
      }
    },
    fontFamily: {
      'sans': ['ui-sans-serif', 'system-ui',],
      'serif': ['ui-serif', 'Georgia',],
      'mono': ['ui-monospace', 'SFMono-Regular',],
      'display': ['Oswald',],
      'body': ['"Open Sans"',],
      'jost': ['"Jost"',]
    }
  },
  plugins: []
}