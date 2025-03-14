import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import Courses from "@/components/Instructor/Courses";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import { getMyCourses } from "@/actions/instructor/getMyCourses";
export const dynamic = "force-dynamic";

export default async function MyCoursesPage({ params: { lang } }) {
	const { courses } = await getMyCourses();
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect(`/${lang}`);
	}
	return (
		<>
			<PageBannerTitle
				title="Instructor courses"
				homeText="Home"
				homeUrl={`/${lang}`}
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<Courses courses={courses} currentUser={currentUser} />

				
			</div>
		</>
	);
}
