/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: "#080810",
                card: "#0d0d1c",
                orange: "#E85D04",
                text: "#eeeef8",
                muted: "#666677",
                green: "#22c55e",
                red: "#ef4444",
            },
            fontFamily: {
                display: ["Bebas Neue", "sans-serif"],
                body: ["Syne", "sans-serif"],
                mono: ["Space Mono", "monospace"],
            },
            borderRadius: {
                DEFAULT: "4px",
            }
        },
    },
    plugins: [],
}
