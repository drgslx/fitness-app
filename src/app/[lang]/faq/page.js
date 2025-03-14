import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import FaqContent from "@/components/Faq/FaqContent";

export default function FaqPage() {
	return (
		<>
			<PageBannerTitle
				title="Domande Frequenti (FAQ)"
				homeText="Home"
				homeUrl="/"
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<FaqContent />

				
			</div>
		</>
	);
}
