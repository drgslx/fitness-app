import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import Profile from "@/components/Profile/Profile";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function Page({ params: { lang } }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect(`/${lang}/login`);
	}
	return (
		<>
			<PageBannerTitle
				title="My Profile"
				homeText="Home"
				homeUrl="/"
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<Profile currentUser={currentUser} />

				
			</div>
		</>
	);
}
