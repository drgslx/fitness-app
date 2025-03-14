import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import CourseDetailsContent from "@/components/CourseDetails/CourseDetailsContent";
import RelatedCourses from "@/components/Courses/RelatedCourses";
import { getSingleCourse } from "@/actions/getSingleCourse";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function generateMetadata({ params }) {
	const { course } = await getSingleCourse(params);
	return {
		title: course.title,
		openGraph: {
			images: [course.image],
		},
	};
}

export default async function CourseDetailsPage({ params }) {
	const { course, related } = await getSingleCourse(params);
	const currentUser = await getCurrentUser();
	// console.log(related);
	return (
		<>
			<PageBannerTitle
				title={course.title}
				homeText="Home"
				homeUrl="/"
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<CourseDetailsContent
					course={course}
					currentUser={currentUser}
				/>

				<RelatedCourses related={related} currentUser={currentUser} />

				
			</div>
		</>
	);
}
