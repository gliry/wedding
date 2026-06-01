/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base — warm cream paper / editorial neutrals
        bg: '#F4EDDF',           // primary cream background
        'bg-soft': '#EBE1CD',    // deeper linen for cards / sections
        'bg-warm': '#F8F3E8',    // lightest warm white for contrast
        // Text — warm brown-black for editorial feel
        ink: '#2B2719',          // primary dark text
        'ink-muted': '#6B6455',  // secondary muted text
        // Accents — sage / olive / taupe from reference
        'sage-soft': '#DCE0D0',  // pale sage — alternating section bands
        sage: '#8B9579',         // main accent — soft sage green
        olive: '#5E6B4B',        // deeper olive for emphasis
        taupe: '#A79177',        // warm taupe for tertiary accents
      },
      fontFamily: {
        sans: ['"LT Remark"'],
        display: ['"Anastasia Script"', 'cursive'],
        script: ['"Anastasia Script"', 'cursive'],
      },
    },
  },
  plugins: [],
}
