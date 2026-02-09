import { League_Spartan, Poppins } from "next/font/google";
import QueryProvider from "../QueryProvider"
import "swiper/css/bundle";
import "../../../public/css/navbar.css";
import "remixicon/fonts/remixicon.css";
import "../globals.css";
import TosterProvider from "@/providers/TosterProvider";
import AosProvider from "@/providers/AosProvider";
import BackToTop from "@/components/Layout/BackToTop";
import TopHeader from "@/components/Layout/TopHeader";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { getCurrentUser } from "@/actions/getCurrentUser";
import LanguageSwitcher from "@/components/Layout/LangSwitcher";
import CookieConsent from "@/components/Shared/CookieConsent";
import GoToBottom from "@/components/Layout/GoToBottom";
import { getAnnouncements } from "@/actions/admin/getAnnouncements";

// For all heading font
const league_spartan = League_Spartan({
	subsets: ["latin"],
	variable: "--font-league-spartan",
	display: "swap",
});

// For all body text font
const poppins = Poppins({
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
	variable: "--font-poppins",
	display: "swap",
});

export const metadata = {
	title: "Ultimate Arena Fighting",
	description: "Website created for the ultiamte arena fighting club",
};


export default async function RootLayout({ children, params: { lang } }) {
	const currentUser = await getCurrentUser();
	const isAdmin = currentUser?.role === "ADMIN";
	const isUser = currentUser?.role === "USER";
	// console.log(currentUser);
	return (
		<html
			lang={lang}
			dir={lang === "ar" ? "rtl" : "ltr"}
			className={`${league_spartan.variable} ${poppins.variable}`}
		>
			<body className={poppins.variable} suppressHydrationWarning={true}>
				<div className="bg-black overflow-x-hidden">
				<TosterProvider />
				<TopHeader />
				<Navbar isAdmin={isAdmin} isUser={isUser} currentUser={currentUser} />
				<QueryProvider>

				{children}	
				</QueryProvider>
				
				
				<AosProvider />
				<BackToTop />
				<GoToBottom />
				<Footer isAdmin={isAdmin} />
				<CookieConsent />
				</div>
				
				
				{/* <LanguageSwitcher /> */}
			</body>
		</html>
	);
}
