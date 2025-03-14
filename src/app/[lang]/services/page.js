import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import ServicesList from "@/components/Services/ServicesList";

export default function ServicesPage({ params: { lang } }) {
	return (
		<>
			<PageBannerTitle
				title="Corsi"
				homeText="Home"
				homeUrl={`/${lang}`}
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<ServicesList />

				
			</div>
		</>
	);
}
