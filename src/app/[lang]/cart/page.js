import PageBannerTitle from "@/components/Shared/PageBannerTitle";
import CartContent from "./CartContent";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { redirect } from "next/navigation";

export default async function CartPage({ params: { lang } }) {
	const currentUser = await getCurrentUser();
	if (!currentUser) {
		redirect(`/${lang}/login`);
	}
	return (
		<>
			<PageBannerTitle
				title="Cart"
				homeText="Home"
				homeUrl={`/${lang}`}
				image="/images/shape1.jpg"
				image2="/images/shape2.jpg"
				image3="/images/shape3.jpg"
image4="/images/shape4.jpg"
			/>

			<CartContent />
		</>
	);
}
