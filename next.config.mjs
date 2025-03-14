/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true,
		domains: [
			"res.cloudinary.com",
			"avatars.githubusercontent.com",
			"lh3.googleusercontent.com",
			"via.placeholder.com",
			"developers.google.com",
		],
	},
	env: {
		NEXTAUTH_SECRET: "b51afa1ed38dde0d5d8f21gftybjsygg458086548a7fe48e1a",
		NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "danqahfpk",
		NEXT_CLOUDINARY_PRESET: "puyuzz8y",
		STRIPE_PUBLISHABLE_KEY: "pk_test_ZaZZWZGlv12yFleIqyjSI00G4e18Kf7",
		STRIPE_SECRET_KEY: "sk_test_2DqyjEwaU0NqMVQ3qSAw00zgrbnfPk",
	},
};

export default nextConfig;
