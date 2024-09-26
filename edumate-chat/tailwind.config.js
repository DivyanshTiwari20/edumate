// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     require('@tailwindcss/forms'),
//   ],
//   darkMode: 'class',
// }

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',  // Include all relevant file types
  ],
  theme: {
    extend: {},  // Customize your theme here
  },
  plugins: [],   // Add any Tailwind plugins if necessary
}
