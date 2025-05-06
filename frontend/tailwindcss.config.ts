/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{ts,tsx}", // ✅ App directory
    "./src/components/**/*.{ts,tsx}", // ✅ Your components
    "./src/pages/**/*.{ts,tsx}", // (if using pages dir)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
