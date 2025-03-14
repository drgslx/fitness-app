import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import Partner from "@/components/Shared/Partner";
import NewsletterBox from "@/components/Shared/NewsletterBox";
import EventsList from "@/components/Events/EventsList";
import { getEvents } from "@/actions/admin/getEvents";
import OurNextEvents from "@/components/Shared/OurNextEvents";

export const metadata = {
	title: "Eventi | Ultimate Arena Fighting",
};

export default async function EventsPage({ params: { lang } }) {
	const { events } = await getEvents();

	

	return (
		<>
			<PageBannerTitle
				title="Tutti gli eventi"
				homeText="Home"
				homeUrl={`/${lang}`}
				image="/images/shape1.jpg"
				image2="/images/shape3.jpg"
				image3="/images/shape4.jpg"
			/>

			<div className="bg-black">
				<EventsList events={events} />


				
			</div>
		</>
	);
}
