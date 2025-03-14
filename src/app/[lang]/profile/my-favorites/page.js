import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import MyCourses from "@/components/Profile/MyCourses";
import { getMyFavourites } from "@/actions/getMyFavourites";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function MyFavoritiesPage({ params: { lang } }) {
	const { favourites } = await getMyFavourites();
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect(`/${lang}/login`);
	}
	return (
		<>
			<PageBannerTitle
				title="My Favorities"
				homeText="Home"
				homeUrl={`/${lang}`}
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<MyCourses favourites={favourites} currentUser={currentUser} />

				
			</div>
		</>
	);
}
