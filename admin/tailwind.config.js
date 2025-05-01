/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
        extend: {
          fontFamily: {
            sans: ['"Uber Move"', 'sans-serif'],
          },
        },
      },
  plugins: [],
}












// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['"Uber Move"', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// }