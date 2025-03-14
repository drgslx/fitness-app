import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import BlogDetailsContent from "@/components/Blog/BlogDetailsContent";

export default function BlogDetailsPage() {
	return (
		<>
			<PageBannerTitle
				title="Blog setails"
				homeText="Home"
				homeUrl="/"
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<BlogDetailsContent />

			</div>
		</>
	);
}
