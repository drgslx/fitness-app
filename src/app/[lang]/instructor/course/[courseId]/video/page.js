import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";
import UploadVideoForm from "@/components/Instructor/UploadVideoForm";

export default async function CreateCoursePage({ params: { courseId, lang } }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect(`/${lang}`);
	}
	return (
		<>
			<PageBannerTitle
				title={`Upload Videos`}
				homeText="Home"
				homeUrl={`/${lang}`}
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<UploadVideoForm courseId={courseId} />

				
			</div>
		</>
	);
}
