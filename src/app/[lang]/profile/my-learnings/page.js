import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import MyCourses from "@/components/Profile/MyCourses";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { myLearnings } from "@/actions/myLearnings";

export default async function MyLearningsPage({ params: { lang } }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect(`/${lang}/login`);
	}
	const { enrolments } = await myLearnings();
	return (
		<>
			<PageBannerTitle
				title="My courses"
				homeText="Home"
				homeUrl={`/${lang}`}
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<MyCourses
					favourites={enrolments}
					buy={true}
					currentUser={currentUser}
				/>

				
			</div>
		</>
	);
}
