/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {},
		screens: {
			sm: "576px",
			// => @media (min-width: 576px) { ... }

			md: "768px",
			// => @media (min-width: 768px) { ... }

			lg: "992px",
			// => @media (min-width: 1024px) { ... }

			xl: "1200px",
			// => @media (min-width: 1200px) { ... }

			"2xl": "1350px",
			// => @media (min-width: 1350px) { ... }
		},
		container: {
			padding: "0px",
		},
	},
	plugins: [],
};
