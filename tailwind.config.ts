module.exports = {
    content: [
      './src/**/*.{js,jsx,ts,tsx}', // Adjust this path according to your project structure
    ],
    theme: {
      extend: {
        colors: {
          primary: '#1da1f2',
          secondary: '#14171a',
          // add more custom colors here
        },
      },
    },
    plugins: [
        require('flowbite/plugin')
    ]
  }