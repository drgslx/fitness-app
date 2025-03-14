import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import CoursesList from "@/components/Courses/CoursesList";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { getCourses } from "@/actions/getCourses";
import { getInstructors } from "@/actions/admin/getInstructors";

export const metadata = {
	title: "Courses | Ultimate Arena Fighting",
};

export default async function CoursesPage({ params: { lang }, searchParams }) {
	const currentUser = await getCurrentUser();
	const {  totalPages, totalCourses } = await getCourses(
		searchParams
	);

	const {courses} =await getCourses(searchParams);
	return (
		<>
			<PageBannerTitle
				title="Courses"
				homeText="Home"
				homeUrl="/"
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<CoursesList
					courses={courses}
					totalCourses={totalCourses}
					totalPages={totalPages}
					currentUser={currentUser}
				/>

				
			</div>
		</>
	);
}
